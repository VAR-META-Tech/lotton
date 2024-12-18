import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import type { Message, Transaction } from '@ton/core';
import { Address, fromNano } from '@ton/core';
import { TonClient } from '@ton/ton';
import bigDecimal from 'js-big-decimal';
import TonWeb from 'tonweb';
import { Repository } from 'typeorm';

import type { StellaConfig } from '@/configs';
import type { Pool, PoolPrize, Token } from '@/database/entities';
import {
  LatestBlock,
  PoolRound,
  Prizes,
  Transaction as TransactionDB,
  UserTicket,
} from '@/database/entities';
import {
  EVENT_HEADER,
  PoolStatusEnum,
  TransactionType,
  UserTicketStatus,
} from '@/shared/enums';

import {
  getCurrentPool,
  loadBuyTicket,
  loadClaimedEvent,
  loadPoolCreatedEvent,
  loadTicketBoughtEvent,
  loadWinningNumbersDrawnEvent,
} from './contract_funcs';
import { calculatorMatch, splitTickets } from './func';
import dayjs from 'dayjs';

@Injectable()
export class CrawlWorkerService {
  constructor(
    @InjectRepository(LatestBlock)
    private readonly latestBlockRepository: Repository<LatestBlock>,
    private readonly configService: ConfigService<StellaConfig>,
    private readonly transactionRepository: Repository<TransactionDB>,
    private readonly tokenRepository: Repository<Token>,
    private readonly userTicketRepository: Repository<UserTicket>,
    private readonly poolRoundRepository: Repository<PoolRound>,
    private readonly poolRepository: Repository<Pool>,
    private readonly prizesRepository: Repository<Prizes>,
    private readonly poolPrizeRepository: Repository<PoolPrize>,
    private readonly gameContractAddress: Address,
    private readonly tonClient: TonClient,
  ) {}

  async doCrawlJob() {
    try {
      const currentBlockNumber = (await this.getCurrentBloc()).blockNumber;
      const latestBlockNumber = (await this.getContractState()).lastTransaction
        .lt;
      Logger.debug(
        'IN DB: ' + currentBlockNumber + ' ONCHAIN: ' + latestBlockNumber,
      );

      if (+currentBlockNumber >= +latestBlockNumber) return;

      const transactions = await this.getTransactions(
        latestBlockNumber,
        currentBlockNumber.toString(),
      );

      Logger.debug('Transaction Length: ' + transactions.length);

      for (const tx of transactions.reverse()) {
        const isAbortedTx = tx.description?.['aborted'];
        if (isAbortedTx) continue;

        const inMsg = tx.inMessage;
        if (inMsg?.info.type == 'internal') {
          const originalBody = inMsg?.body.beginParse();
          const body = originalBody.clone();
          const op = body.loadUint(32);

          Logger.debug('op: ' + op);
          Logger.debug('lt: ' + tx.lt);

          switch (op) {
            case EVENT_HEADER.CREATE_POOL_EVENT:
              await this.createPoolEvent(tx);
              break;
            case EVENT_HEADER.BUY_TICKETS_EVENT:
              await this.buyTicketsEvent(tx);
              break;
            case EVENT_HEADER.DRAW_WINNING_NUMBER:
              await this.drawWinningNumber(tx);
              break;
            case EVENT_HEADER.USER_CLAIM_PRIZE:
              await this.userClaimPrize(tx);
              break;

            default:
              break;
          }
        }
      }

      await this.updateBlockLt(latestBlockNumber);
    } catch (error) {
      console.error('Error at: doCrawlJob');
      console.log(error);
    }
  }

  async userClaimPrize(tx: Transaction) {
    const inMsgs = tx.inMessage;
    const outMsgs = this.getBodyExternalOut(tx.outMessages.values());
    if (outMsgs.length === 0) return;

    const outMsgsList = this.getBodyExternalOut(tx.outMessages.values());
    const outMsgsFirst = outMsgsList[0];
    const originalOutMsgBody = outMsgsFirst?.body.beginParse();
    const payloadOutMsg = loadClaimedEvent(originalOutMsgBody);

    const txHash = tx.hash().toString('hex');
    const token = await this.tokenRepository.findOneBy({ symbol: 'TON' });

    const newTransaction: Partial<TransactionDB> = {
      fromAddress: this.parseAddress(inMsgs.info.src.toString()),
      toAddress: this.parseAddress(tx.inMessage.info.dest.toString()),
      value: fromNano(payloadOutMsg?.amount ?? 0),
      type: TransactionType.CLAIM,
      blockTimestamp: tx.lt.toString(),
      transactionHash: txHash,
      token,
      id: null,
    };

    const userClaimAddress = payloadOutMsg.receiver.toRawString();

    await Promise.all([
      this.saveTxUserClaim(newTransaction),
      this.setTicketClaim(
        Number(payloadOutMsg.poolId),
        Number(payloadOutMsg.roundId),
        userClaimAddress,
        dayjs().unix(),
      ),
      this.setClaimedPrize(
        Number(payloadOutMsg.poolId),
        Number(payloadOutMsg.roundId),
        Number(payloadOutMsg.amount),
      ),
    ]);
  }

  async setClaimedPrize(
    poolIdOnChain: number,
    roundIdOnChain: number,
    amount: number,
  ) {
    const prizes = await this.prizesRepository.findOneBy({
      poolIdOnChain,
      roundIdOnChain,
    });
    if (!prizes) return;

    prizes.claimedPrizes = (prizes.claimedPrizes ?? 0) + amount;
    this.prizesRepository.save(prizes);
  }

  async setTicketClaim(
    poolIdOnChain: number,
    roundIdOnChain: number,
    userWallet: string,
    claimedAt: number,
  ) {
    const roundExist = await this.poolRoundRepository.findOneBy({
      roundIdOnChain,
      pool: {
        poolIdOnChain,
      },
    });

    if (!roundExist) return;

    const tickets = await this.userTicketRepository
      .createQueryBuilder('userTicket')
      .leftJoin('userTicket.round', 'round')
      .where('round.id = :roundId', { roundId: roundExist.id })
      .andWhere('userTicket.userWallet = :userWallet', { userWallet })
      .andWhere('userTicket.winningMatch > 0')
      .getMany();

    await this.userTicketRepository.save(
      tickets.map((ticket) => ({
        ...ticket,
        status: UserTicketStatus.CONFIRMED_CLAIM,
        claimedAt,
      })),
    );
  }

  async saveTxUserClaim(tx: Partial<TransactionDB>) {
    await this.transactionRepository
      .createQueryBuilder()
      .insert()
      .into(TransactionDB)
      .values(tx)
      .orUpdate(
        [
          'fromAddress',
          'toAddress',
          'value',
          'blockTimestamp',
          'quantity',
          'type',
        ],
        ['transactionHash'],
      )
      .execute();
  }

  async drawWinningNumber(tx: Transaction) {
    const outMsgsList = this.getBodyExternalOut(tx.outMessages.values());

    const outMsgsFirst = outMsgsList[0];
    const originalOutMsgBody = outMsgsFirst?.body.beginParse();
    const payloadOutMsg = loadWinningNumbersDrawnEvent(originalOutMsgBody);

    const tickets = splitTickets(payloadOutMsg.winningNumber.toString(), 1);

    // Set draw winning code for round
    const roundExist = await this.poolRoundRepository.findOneBy({
      roundIdOnChain: Number(payloadOutMsg.roundId),
      pool: {
        poolIdOnChain: Number(payloadOutMsg.poolId),
      },
    });

    if (!roundExist) return;

    const txHash = tx.hash().toString('hex');

    roundExist.winningBlock = txHash;
    roundExist.winningCode = tickets?.[0];
    await this.poolRoundRepository.save(roundExist);

    // Set winning code for user ticket
    const userTicketsExist = await this.userTicketRepository.findBy({
      round: {
        id: roundExist.id,
      },
    });
    const userTicketsUpdate = userTicketsExist.map((ticket) => ({
      ...ticket,
      winningCode: tickets?.[0],
      winningMatch: calculatorMatch(ticket.code, tickets?.[0] ?? ''),
    }));
    await this.userTicketRepository.save(userTicketsUpdate);

    // Calculator round prize
    const roundPrize = await this.prizesRepository.findOneBy({
      poolIdOnChain: Number(payloadOutMsg.poolId),
      roundIdOnChain: Number(payloadOutMsg.roundId),
    });

    if (!roundPrize) return;

    const totalTicketsMatch = await this.getTotalTicketMatch(
      Number(payloadOutMsg.roundId),
    );

    if (totalTicketsMatch.length === 0) {
      roundPrize.winningPrizes = 0;
      return await this.prizesRepository.save(roundPrize);
    }

    const poolPrizes = await this.poolPrizeRepository.findBy({
      pool: {
        poolIdOnChain: Number(payloadOutMsg.poolId),
      },
    });

    const totalPrizesDecimal = new bigDecimal(roundPrize.totalPrizes);
    const totalWinningPrizes = poolPrizes.reduce((acc, prize) => {
      const getTotalTickets = totalTicketsMatch.find(
        (match) => match.winningMatch === prize.matchNumber,
      );
      if (!getTotalTickets) return acc;

      const allocationDecimal = new bigDecimal(prize.allocation);
      // const totalTicketsDecimal = new bigDecimal(getTotalTickets.totalTickets);
      const percentDecimal = new bigDecimal(100);

      return acc.add(
        totalPrizesDecimal.multiply(allocationDecimal).divide(percentDecimal),
        // .divide(totalTicketsDecimal),
      );
    }, new bigDecimal(0));

    roundPrize.winningPrizes = +totalWinningPrizes.getValue();
    await this.prizesRepository.save(roundPrize);
  }

  getTotalTicketMatch(roundId: number) {
    return this.userTicketRepository
      .createQueryBuilder('userTicket')
      .leftJoin('userTicket.round', 'round')
      .where(
        'userTicket.winningMatch IS NOT NULL AND userTicket.winningMatch > 0',
      )
      .andWhere('round.roundIdOnChain = :roundId', {
        roundId,
      })
      .select([
        'COUNT(userTicket.id) as totalTickets',
        'userTicket.winningMatch as winningMatch',
      ])
      .groupBy('userTicket.winningMatch')
      .getRawMany();
  }

  async buyTicketsEvent(tx: Transaction) {
    const inMsgs = tx.inMessage;
    const outMsgs = this.getBodyExternalOut(tx.outMessages.values());

    if (outMsgs.length === 0) return;

    const originalOutMsgBody = outMsgs[0]?.body.beginParse();
    const originalInMsgBody = inMsgs?.body.beginParse();
    const payloadOutMsg = loadTicketBoughtEvent(originalOutMsgBody);
    const payloadInMsg = loadBuyTicket(originalInMsgBody);

    // Create transaction buy ticket
    const txHash = tx.hash().toString('hex');
    const token = await this.tokenRepository.findOneBy({ symbol: 'TON' });

    const newTransaction: Partial<TransactionDB> = {
      fromAddress: this.parseAddress(inMsgs.info.src.toString()),
      toAddress: this.parseAddress(tx.inMessage.info.dest.toString()),
      quantity: Number(payloadInMsg.quantity),
      value: payloadOutMsg?.totalCost
        ? fromNano(payloadOutMsg?.totalCost)
        : '0',
      type: TransactionType.BUY,
      blockTimestamp: tx.lt.toString(),
      transactionHash: txHash,
      token,
      id: null,
    };

    await this.transactionRepository
      .createQueryBuilder()
      .insert()
      .into(TransactionDB)
      .values(newTransaction)
      .orUpdate(
        [
          'fromAddress',
          'toAddress',
          'value',
          'blockTimestamp',
          'quantity',
          'type',
        ],
        ['transactionHash'],
      )
      .execute();

    const transaction = await this.transactionRepository.findOneBy({
      transactionHash: txHash,
    });

    const tickets = splitTickets(
      payloadOutMsg.tickets,
      Number(payloadInMsg.quantity),
    );

    const roundExist = await this.poolRoundRepository.findOneBy({
      roundIdOnChain: Number(payloadOutMsg.roundId),
      pool: {
        poolIdOnChain: Number(payloadOutMsg.poolId),
      },
    });

    if (!roundExist) return;

    // Create user tickets
    await this.userTicketRepository
      .createQueryBuilder()
      .insert()
      .into(UserTicket)
      .values(
        tickets.map((t) => ({
          id: null,
          userWallet: this.parseAddress(inMsgs.info.src.toString()),
          round: roundExist,
          code: t,
          transaction: transaction,
          status: UserTicketStatus.BOUGHT,
        })),
      )
      .orUpdate(['roundId'], ['transactionId', 'userWallet', 'code'])
      .execute();

    // Sum total prizes
    const poolExist = await this.getPool(Number(payloadOutMsg.poolId));
    if (!poolExist) return;
    const totalTickets = await this.getTotalTicketOfRound(
      roundExist.roundIdOnChain,
      Number(payloadOutMsg.poolId),
    );
    const totalTicketAmount = totalTickets * Number(poolExist.ticketPrice);

    let roundPrize: Partial<Prizes>;

    if (roundExist.roundIdOnChain === 1) {
      roundPrize = {
        id: null,
        poolIdOnChain: Number(payloadOutMsg.poolId),
        roundIdOnChain: Number(payloadOutMsg.roundId),
        totalTicketAmount,
        totalPrizes: totalTicketAmount,
        previousPrizes: 0,
      };
    } else {
      const getPreviousPrize = await this.prizesRepository
        .createQueryBuilder('prize')
        .where('poolIdOnChain = :poolIdOnChain', {
          poolIdOnChain: Number(payloadOutMsg.poolId),
        })
        .andWhere('roundIdOnChain < :roundIdOnChain', {
          roundIdOnChain: roundExist.roundIdOnChain,
        })
        .orderBy('prize.roundIdOnChain', 'DESC')
        .getOne();
      const previousPrizes =
        (getPreviousPrize?.totalPrizes ?? 0) -
        (getPreviousPrize?.winningPrizes ?? 0);

      roundPrize = {
        id: null,
        poolIdOnChain: Number(payloadOutMsg.poolId),
        roundIdOnChain: Number(payloadOutMsg.roundId),
        totalTicketAmount,
        totalPrizes: previousPrizes + totalTicketAmount,
        previousPrizes: previousPrizes,
      };
    }

    await this.setPrizesRound(roundPrize);
  }

  async createPoolEvent(tx: Transaction) {
    const outMsgsList = this.getBodyExternalOut(tx.outMessages.values());
    const outMsgs = outMsgsList?.[0];
    const originalBody = outMsgs?.body?.beginParse();
    const payload = loadPoolCreatedEvent(originalBody);

    const pool = await this.poolRepository.findOneBy({
      status: PoolStatusEnum.INACTIVE,
      startTime: Number(payload.startTime),
      sequency: Number(payload.sequence),
    });

    if (!pool) return;
    pool.poolIdOnChain = Number(payload.poolId);
    pool.totalRounds = payload.rounds.values().length;
    pool.endTime = Number(payload.endTime);
    pool.ticketPrice = Number(payload.ticketPrice);
    pool.status = PoolStatusEnum.ACTIVE;

    await this.poolRepository.save(pool);
    const rounds = payload.rounds.values();

    await this.poolRoundRepository
      .createQueryBuilder()
      .insert()
      .into(PoolRound)
      .values(
        rounds.map((round) => ({
          id: null,
          pool: pool,
          roundIdOnChain: Number(round.roundId),
          roundNumber: Number(round.roundId),
          startTime: Number(round.startTime),
          endTime: Number(round.endTime),
        })),
      )
      .orUpdate(
        ['roundNumber', 'startTime', 'endTime'],
        ['poolId', 'roundIdOnChain'],
      )
      .execute();
  }

  async getPools() {
    try {
      const pools = (
        await getCurrentPool(this.tonClient.provider(this.gameContractAddress))
      ).values();

      return pools;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async updateBlockLt(lt: string) {
    try {
      const currentBlock = await this.getCurrentBloc();
      currentBlock.blockNumber = +lt;
      return await this.latestBlockRepository.save(currentBlock);
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async getCurrentBloc() {
    return this.latestBlockRepository
      .createQueryBuilder('latestBlock')
      .where(`latestBlock.key=:key`, {
        key: `crawl_${this.configService.get('contract.gameContractAddress', {
          infer: true,
        })}`,
      })
      .getOne();
  }

  async getContractState() {
    try {
      const contractState = await this.tonClient.getContractState(
        this.gameContractAddress,
      );
      return contractState;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async getTransactions(fromLt: string, toLt: string) {
    return this.tonClient.getTransactions(this.gameContractAddress, {
      lt: fromLt,
      to_lt: toLt,
      limit: 100,
    });
  }

  getTotalTicketOfRound(roundIdOnChain: number, poolIdOnChain: number) {
    return this.userTicketRepository.countBy({
      round: {
        roundIdOnChain,
        pool: {
          poolIdOnChain,
        },
      },
    });
  }

  getPool(poolIdOnChain) {
    return this.poolRepository.findOneBy({
      poolIdOnChain,
    });
  }

  setPrizesRound(roundPrize: Partial<Prizes>) {
    return this.prizesRepository
      .createQueryBuilder()
      .insert()
      .into(Prizes)
      .values(roundPrize)
      .orUpdate(
        ['totalPrizes', 'totalTicketAmount', 'previousPrizes'],
        ['poolIdOnChain', 'roundIdOnChain'],
      )
      .execute();
  }

  wait(timeout: number) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  }

  parseAddress(address: string) {
    if (TonWeb.utils.Address.isValid(address))
      return Address.parse(address).toRawString();
    return address;
  }
  getBodyExternalOut(body: Message[]) {
    return body.filter((msg) => msg.info.type === 'external-out');
  }
}
