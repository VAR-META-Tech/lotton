import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import type { Transaction } from '@ton/core';
import { Address } from '@ton/core';
import { TonClient } from '@ton/ton';
import TonWeb from 'tonweb';
import { Repository } from 'typeorm';

import type { StellaConfig } from '@/configs';
import type { PoolRound, Token } from '@/database/entities';
import { UserTicket } from '@/database/entities';
import { Transaction as TransactionDB } from '@/database/entities';
import { LatestBlock } from '@/database/entities';

import {
  loadBuyTicket,
  loadPoolCreatedEvent,
  loadTicketBoughtEvent,
  loadWinningNumbersDrawnEvent,
} from './contract_funcs';

@Injectable()
export class CrawlWorkerService {
  tonClient: TonClient;
  gameContractAddress: Address;

  constructor(
    @InjectRepository(LatestBlock)
    private readonly latestBlockRepository: Repository<LatestBlock>,
    private readonly configService: ConfigService<StellaConfig>,
    private readonly transactionRepository: Repository<TransactionDB>,
    private readonly tokenRepository: Repository<Token>,
    private readonly userTicketRepository: Repository<UserTicket>,
    private readonly poolRoundRepository: Repository<PoolRound>,
  ) {
    this.tonClient = new TonClient({
      endpoint: this.configService.get('contract.rpcEndpoint', {
        infer: true,
      }),
      apiKey: this.configService.get('contract.apiKey', {
        infer: true,
      }),
    });

    this.gameContractAddress = this.configService.get(
      'contract.gameContractAddress',
      {
        infer: true,
      },
    );
  }

  async doCrawlJob() {
    try {
      const currentBlockNumber = (await this.getCurrentBloc()).blockNumber;
      const latestBlockNumber = (await this.getContractState()).lastTransaction
        .lt;

      if (+currentBlockNumber >= +latestBlockNumber) return;

      const transactions = await this.getTransactions(
        latestBlockNumber,
        (currentBlockNumber + 1).toString(),
      );

      for (const tx of transactions) {
        const isAbortedTx = tx.description?.['aborted'];
        if (isAbortedTx) continue;

        const inMsg = tx.inMessage;
        if (inMsg?.info.type == 'internal') {
          const originalBody = inMsg?.body.beginParse();
          const body = originalBody.clone();
          const op = body.loadUint(32);
          switch (op) {
            // case 2004140043:
            //   this.createPoolEvent(tx);
            //   break;
            case 3748203161:
              this.buyTicketsEvent(tx);
              break;
            case 3591482628:
              this.drawWinningNumber(tx);
              break;

            default:
              break;
          }
        }
      }

      await this.updateBlockLt(latestBlockNumber);
    } catch (error) {
      console.log(error);
    }
  }

  async drawWinningNumber(tx: Transaction) {
    const outMsgsList = tx.outMessages
      .values()
      .filter((msg) => msg.info.type === 'external-out');
    const outMsgsFirst = outMsgsList[0];
    const originalOutMsgBody = outMsgsFirst?.body.beginParse();
    const payloadOutMsg = loadWinningNumbersDrawnEvent(originalOutMsgBody);

    const tickets = this.splitTickets(
      payloadOutMsg.winningNumber.toString(),
      1,
    );

    // Set draw winning code for round
    const roundExist = await this.poolRoundRepository.findOneBy({
      roundIdOnChain: Number(payloadOutMsg.roundId),
    });
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
      winningMatch: this.calculatorMatch(ticket.code, tickets?.[0] ?? ''),
    }));
    await this.userTicketRepository.save(userTicketsUpdate);
  }

  async buyTicketsEvent(tx: Transaction) {
    try {
      const inMsgs = tx.inMessage;
      const outMsgs = tx.outMessages
        .values()
        .filter((msg) => msg.info.type === 'external-out');
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
        value: payloadInMsg.quantity.toString(),
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
          ['fromAddress', 'toAddress', 'value', 'blockTimestamp'],
          ['transactionHash'],
        )
        .execute();

      const transaction = await this.transactionRepository.findOneBy({
        transactionHash: txHash,
      });

      const tickets = this.splitTickets(
        payloadOutMsg.tickets,
        Number(payloadInMsg.quantity),
      );

      const roundExist = await this.poolRoundRepository.findOneBy({
        roundIdOnChain: Number(payloadOutMsg.roundId),
      });

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
          })),
        )
        .orUpdate(['roundId'], ['transactionId', 'userWallet', 'code'])
        .execute();
    } catch (error) {
      console.log(error);
    }
  }

  splitTickets(ticketsList: string, quantity: number) {
    const ticketsString = ticketsList
      .replace(/,/g, '')
      .substring(0, 4 * 2 * quantity);

    const tickets = [];
    for (let i = 0; i < ticketsString.length; i += 8) {
      const ticket = ticketsString.substring(i, i + 8);
      let ticketConvert = '';

      for (let i = 0; i < ticket.length; i += 2) {
        const ticketChar = ticket.substring(i, i + 2);
        ticketConvert += String.fromCharCode(+ticketChar);
      }
      tickets.push(ticketConvert);
    }

    return tickets;
  }

  async createPoolEvent(tx: Transaction) {
    const outMsgs = tx.outMessages.values()[0];
    const originalBody = outMsgs?.body.beginParse();
    const body = originalBody.clone();
    const payload = loadPoolCreatedEvent(originalBody);

    return { payload, body };
  }

  async updateBlockLt(lt: string) {
    const currentBlock = await this.getCurrentBloc();
    currentBlock.blockNumber = +lt;
    return await this.latestBlockRepository.save(currentBlock);
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
    const contractState = await this.tonClient.getContractState(
      this.gameContractAddress,
    );
    return contractState;
  }

  async getTransactions(fromLt: string, toLt: string) {
    return this.tonClient.getTransactions(this.gameContractAddress, {
      lt: fromLt,
      to_lt: toLt,
      limit: 100,
    });
  }

  wait(timeout: number) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  }

  parseAddress(address: string) {
    if (TonWeb.utils.Address.isValid(address))
      return Address.parse(address).toRawString();
    return address;
  }

  calculatorMatch(userCode: string, winningCode: string) {
    for (let index = winningCode.length; index >= 0; index--) {
      if (userCode.slice(0, index) === winningCode.slice(0, index))
        return index;
    }

    return 0;
  }
}
