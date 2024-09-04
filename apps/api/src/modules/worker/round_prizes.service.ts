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
import type { Pool, PoolRound } from '@/database/entities';
import { getLogger } from '@/utils/logger';

import {
  getCurrentPool,
  loadGetterTupleUserTicket,
  storeBuyTicket,
  storeCreatePool,
  storeDrawWinningNumbers,
  storeSetAdmin,
} from './contract_funcs';

const logger = getLogger('CrawlTokenService');

export class RoundPrizesService {
  tonClient: TonClient;
  contractAddress: string;

  constructor(
    private poolRepository: Repository<Pool>,
    private poolRoundRepository: Repository<PoolRound>,
    private configService: ConfigService<StellaConfig>,
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
    // this.setAdmin();
    const pools = await this.getPoolsAvailable();
    for (const pool of pools) {
      const rounds = await this.getRoundsAvailable(pool.poolIdOnChain);
      for (const round of rounds) {
        await this.drawWinningNumbers(pool.id, round.id);
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

  async getListPools() {
    const pools = (
      await getCurrentPool(
        this.tonClient.provider(Address.parse(this.contractAddress)),
      )
    ).values();
    console.log(pools);
    console.log('get pools ok');
  }

  async drawWinningNumbers(poolId: number, roundId: number) {
    const { contract, keyPair } = await this.makeWallet();
    // Create a transfer
    // await adminWallet.send(contractProvider, messageDraw);
    console.log('start');
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
    // console.log(transfer);
    // console.log(await contract.getSeqno());
  }

  async getPoolsAvailable() {
    return (
      this.poolRepository
        .createQueryBuilder()
        .where('startTime < UNIX_TIMESTAMP(NOW())')
        // .andWhere('endTime > UNIX_TIMESTAMP(NOW())')
        .getMany()
    );
  }

  async getRoundsAvailable(poolId: number) {
    return this.poolRoundRepository
      .createQueryBuilder()
      .where('poolId = :poolId', { poolId })
      .andWhere('startTime < UNIX_TIMESTAMP(NOW())')
      .andWhere('UNIX_TIMESTAMP(NOW()) > endTime')
      .andWhere('winningCode IS NULL')
      .getMany();
  }
}
