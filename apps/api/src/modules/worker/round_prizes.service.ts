import { Logger } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { mnemonicToPrivateKey } from '@ton/crypto';
import {
  Address,
  beginCell,
  internal,
  toNano,
  TonClient,
  TupleBuilder,
  WalletContractV4,
} from '@ton/ton';
import type { Repository } from 'typeorm';

import type { StellaConfig } from '@/configs';
import type { Pool, PoolRound, UserTicket } from '@/database/entities';
import { PoolStatusEnum } from '@/shared/enums';
import { getLogger } from '@/utils/logger';

import {
  getCurrentPool,
  getResultByRound,
  loadGetterTupleUserTicket,
  storeBuyTicket,
  storeCreatePool,
  storeDrawWinningNumbers,
  storeSetAdmin,
  storeSetPublicKey,
} from './contract_funcs';
import { calculatorMatch, splitTickets } from './func';

const logger = getLogger('CrawlTokenService');

export class RoundPrizesService {
  tonClient: TonClient;
  contractAddress: string;

  constructor(
    private poolRepository: Repository<Pool>,
    private poolRoundRepository: Repository<PoolRound>,
    private configService: ConfigService<StellaConfig>,
    private userTicketRepository: Repository<UserTicket>,
  ) {
    this.tonClient = new TonClient({
      endpoint: this.configService.get('contract.rpcEndpoint', {
        infer: true,
      }),
      apiKey: this.configService.get('contract.apiKey', {
        infer: true,
      }),
    });

    this.contractAddress = this.configService.get(
      'contract.gameContractAddress',
      {
        infer: true,
      },
    );

    this.init().catch((error) => {
      logger.error('Init crawl prizes in round worker error: ');
      logger.error(error);
    });
  }

  async makeWallet() {
    // Convert mnemonics to private key
    const mnemonics = this.configService
      .get('contract.adminWalletPhrase', { infer: true })
      .split(' ');
    const keyPair = await mnemonicToPrivateKey(mnemonics);

    // Create wallet contract
    const workchain = 0; // Usually you need a workchain 0
    const wallet = WalletContractV4.create({
      workchain,
      publicKey: keyPair.publicKey,
    });
    const contract = this.tonClient.open(wallet);

    return { wallet, keyPair, contract };
  }

  async init() {
    // this.userTickets(2, 1);
    // this.createPool();
    // this.getListPools();
    // this.buyTickets();
    // await this.setAdmin();
    // await this.publicKey();

    const pools = await this.getPoolsAvailable();
    for (const pool of pools) {
      const rounds = await this.getRoundsAvailable(pool.id);
      for (const round of rounds) {
        await this.drawWinningNumbers(pool.poolIdOnChain, round.roundIdOnChain);
      }
    }
  }

  async userTickets(poolId: number, roundId: number) {
    const builder = new TupleBuilder();
    builder.writeNumber(poolId);
    builder.writeNumber(roundId);

    const userTickets = (
      await this.tonClient
        .provider(Address.parse(this.contractAddress))
        .get('usersTicket', builder.build())
    ).stack;

    console.log(loadGetterTupleUserTicket(userTickets).users.values());
    console.log('get pools ok');
  }

  async buyTickets() {
    const { contract, keyPair } = await this.makeWallet();

    // Create a transfer
    console.log('start');
    const seqno = await contract.getSeqno();
    const transfer = await contract.createTransfer({
      seqno,
      secretKey: keyPair.secretKey,
      messages: [
        internal({
          value: toNano('0.05'),
          to: this.contractAddress,
          body: beginCell()
            .store(
              storeBuyTicket({
                $$type: 'BuyTicket',
                poolId: BigInt(2),
                roundId: BigInt(1),
                quantity: BigInt(1),
              }),
            )
            .endCell(),
        }),
      ],
    });
    await contract.send(transfer);

    console.log('buy ticket ok');
  }

  async createPool() {
    const { wallet: adminWallet, keyPair } = await this.makeWallet();
    const contract = this.tonClient.open(adminWallet);
    const seqno = await contract.getSeqno();
    const transfer = await contract.createTransfer({
      seqno,
      secretKey: keyPair.secretKey,
      messages: [
        internal({
          value: toNano('0.05'),
          to: this.contractAddress,
          body: beginCell()
            .store(
              storeCreatePool({
                $$type: 'CreatePool',
                jettonWallet: Address.parse(
                  '0QBmPzFlJnqlNaHV22V6midanLx7ch9yRBiUnv6sH8aMfIcP',
                ),
                ticketPrice: BigInt(1),
                initialRounds: BigInt(10),
                startTime: BigInt(new Date().valueOf().toString().slice(0, -3)),
                endTime: BigInt(1725985385),
                sequence: BigInt(1200),
                active: true,
              }),
            )
            .endCell(),
        }),
      ],
    });
    await contract.send(transfer);
    console.log('create ok');
  }

  async setAdmin() {
    const { wallet: adminWallet, keyPair } = await this.makeWallet();
    const contract = this.tonClient.open(adminWallet);
    const seqno = await contract.getSeqno();
    const transfer = await contract.createTransfer({
      seqno,
      secretKey: keyPair.secretKey,
      messages: [
        internal({
          value: toNano('0.05'),
          to: this.contractAddress,
          body: beginCell()
            .store(
              storeSetAdmin({
                $$type: 'SetAdmin',
                admin: Address.parse(
                  '0QBmPzFlJnqlNaHV22V6midanLx7ch9yRBiUnv6sH8aMfIcP',
                ),
              }),
            )
            .endCell(),
        }),
      ],
    });
    await contract.send(transfer);
    console.log('create ok');
  }

  async publicKey() {
    const { wallet: adminWallet, keyPair } = await this.makeWallet();
    const contract = this.tonClient.open(adminWallet);
    const seqno = await contract.getSeqno();
    const transfer = await contract.createTransfer({
      seqno,
      secretKey: keyPair.secretKey,
      messages: [
        internal({
          value: toNano('0.05'),
          to: this.contractAddress,
          body: beginCell()
            .store(
              storeSetPublicKey({
                $$type: 'SetPublicKey',
                publicKey:
                  35697107194817367972172360094398639751774068753154718602415145470517477976469n,
              }),
            )
            .endCell(),
        }),
      ],
    });
    await contract.send(transfer);
    console.log('publicKey ok');
  }

  async getListPools() {
    const pools = (
      await getCurrentPool(
        this.tonClient.provider(Address.parse(this.contractAddress)),
      )
    ).values();
    console.log(pools.map((p) => p.rounds.values()));
    console.log('get pools ok');
  }

  async getResultByRound(poolId: bigint, roundId: bigint) {
    const result = await getResultByRound(
      this.tonClient.provider(Address.parse(this.contractAddress)),
      poolId,
      roundId,
    );

    if (!result) {
      console.log('get getResultByRound ok', result);
      return [];
    }
    const ticketDraw = splitTickets(Number(result).toString(), 1);
    console.log('get getResultByRound ok', ticketDraw);
    return ticketDraw;
  }

  async drawWinningNumbers(poolId: number, roundId: number) {
    try {
      console.log('Draw poolId', poolId, 'roundId', roundId);

      const ticketsDraw = await this.getResultByRound(
        BigInt(poolId),
        BigInt(roundId),
      );
      if (ticketsDraw.length === 1) {
        return await this.setWinningDraw(poolId, roundId, ticketsDraw[0]);
      }

      const { contract, keyPair } = await this.makeWallet();
      // Create a transfer
      const seqno = await contract.getSeqno();
      const transfer = await contract.createTransfer({
        seqno,
        secretKey: keyPair.secretKey,
        messages: [
          internal({
            value: toNano('0.05'),
            to: this.configService.get('contract.gameContractAddress', {
              infer: true,
            }),
            body: beginCell()
              .store(
                storeDrawWinningNumbers({
                  $$type: 'DrawWinningNumbers',
                  poolId: BigInt(poolId),
                  roundId: BigInt(roundId),
                  latestTxHash: '',
                }),
              )
              .endCell(),
          }),
        ],
      });
      await contract.send(transfer);
      console.log('draw ok');
      let newSeqno = seqno;
      do {
        await this.wait(1000);
        newSeqno = await contract.getSeqno();
        console.log(newSeqno);
      } while (newSeqno === seqno);
    } catch (error) {
      Logger.error(error);
    }
  }

  async setWinningDraw(
    poolIdOnChain: number,
    roundIdOnChain: number,
    ticketDraw: string,
  ) {
    // Set draw winning code for round
    const roundExist = await this.poolRoundRepository.findOneBy({
      roundIdOnChain,
      pool: {
        poolIdOnChain,
      },
    });
    roundExist.winningCode = ticketDraw;
    await this.poolRoundRepository.save(roundExist);

    // Set winning code for user ticket
    const userTicketsExist = await this.userTicketRepository.findBy({
      round: {
        id: roundExist.id,
      },
    });
    const userTicketsUpdate = userTicketsExist.map((ticket) => ({
      ...ticket,
      winningCode: ticketDraw,
      winningMatch: calculatorMatch(ticket.code, ticketDraw ?? ''),
    }));
    await this.userTicketRepository.save(userTicketsUpdate);
  }

  async getPoolsAvailable() {
    return this.poolRepository
      .createQueryBuilder('pool')
      .leftJoinAndSelect('pool.rounds', 'rounds', 'rounds.winningCode IS NULL')
      .where('pool.status = :status', { status: PoolStatusEnum.ACTIVE })
      .select(['pool.*', 'COUNT(rounds.id) as totalRoundsNotDraw'])
      .groupBy('pool.id')
      .having('totalRoundsNotDraw > 0')
      .getRawMany();
  }

  async getRoundsAvailable(poolId: number) {
    return this.poolRoundRepository
      .createQueryBuilder()
      .where('poolId = :poolId', { poolId })
      .andWhere('winningCode IS NULL')
      .andWhere('UNIX_TIMESTAMP(NOW()) > endTime')
      .getMany();
  }

  wait(timeout: number) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  }
}
