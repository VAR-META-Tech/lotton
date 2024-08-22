const pLimit = require('p-limit');
import type { DataSource } from 'typeorm';
import { type EntityManager } from 'typeorm';
import { Web3 } from 'web3';
import WebsocketProvider from 'web3-providers-ws';

import type { NetworkToken } from '@/database/entities';
import { LatestBlock, Token, Transaction } from '@/database/entities';
import { getFromCache } from '@/utils/cache';
import { getLogger } from '@/utils/logger';

const logger = getLogger('CrawlTokenService');

enum EventType {
  TRANSFER = 'Transfer',
}

const BATCH_SIZE = 100; // Event group size for parallel processing
const BATCH_LIMIT = 20;
const limit = pLimit(BATCH_LIMIT);

export class CrawlTokenService {
  private _abi;
  private _web3;
  private _contractAddress: string;
  private _contract;
  private _web3Ready = false;
  private _latestBlock: number;
  private _beginningBlock = 37625432;

  constructor(
    private networkToken: NetworkToken,
    private dataSource: DataSource,
  ) {
    this.init().catch((error) => {
      logger.error('Init Crawl Token Worker Error: ');
      logger.error(error);
    });
  }

  async init() {
    this._web3Ready = await this.startWeb3();

    if (this._web3Ready) {
      await this.listenPastEvents();
      await this.listenRealtimeEvents();
    } else {
      logger.error('Web3 is not ready yet!');
      return;
    }
  }

  async startWeb3(): Promise<boolean> {
    try {
      const provider = new WebsocketProvider(
        this.networkToken.network.rpcEndpoint,
        {},
        {
          delay: 5000,
          autoReconnect: true,
          maxAttempts: 50,
        },
      );

      this._web3 = new Web3(provider);
      this._contractAddress = this.networkToken.token.contractAddress;
      this._abi = JSON.parse(this.networkToken.token.abi);

      // Instantiate contract
      this._contract = new this._web3.eth.Contract(
        this._abi,
        this._contractAddress,
      );

      const methods = await this._contract.methods;
      await this.updateToken(methods);

      return true;
    } catch (error) {
      logger.error('Error starting Web3: ');
      logger.error(error);
      setTimeout(() => this.startWeb3(), 5000); // Retry in 5 seconds
      return;
    }
  }

  private async updateToken(methods: any): Promise<void> {
    const name = await methods.name().call();
    const symbol = await methods.symbol().call();
    const decimals = await methods.decimals().call();

    await this.dataSource.transaction(async (manager) => {
      await manager.update(Token, this.networkToken.token.id, {
        name,
        symbol,
        decimals,
      });
    });
  }

  async listenPastEvents(): Promise<void> {
    this._latestBlock = await this.getLatestBlock();

    const fromBlock = this._latestBlock + 1;
    const toBlock = fromBlock + 1000;

    while (fromBlock <= toBlock) {
      const events = await this.fetchEvents(
        EventType.TRANSFER,
        fromBlock,
        toBlock,
      );

      await this.handleEventsInBatches(events);
    }
  }

  async listenRealtimeEvents() {
    const fromBlock = this._latestBlock + 1;

    this._contract.events.Transfer({ fromBlock }).on(
      'data',
      async (event: any) => {
        await limit(() => this.handleTransferEvent(event));
      },

      (error: any) => {
        logger.error('Error in Transfer Event: ');
        logger.error(error);
        return;
      },
    );
  }

  async getLatestBlock(): Promise<number> {
    return this.dataSource.transaction(async (manager) => {
      const latestBlockKey =
        'crawl_transfer_' +
        this.networkToken.network.symbol +
        '_' +
        this._contract._address;

      const latestBlock = await manager
        .createQueryBuilder(LatestBlock, 'block')
        .setLock('pessimistic_write')
        .where('block.key = :key', { key: latestBlockKey })
        .select(['block.blockNumber'])
        .getOne();

      return (
        Number(latestBlock?.blockNumber) ||
        this.networkToken.token.beginningBlock ||
        this._beginningBlock
      );
    });
  }

  private async updateLatestBlock(
    manager: EntityManager,
    toBlock: number,
  ): Promise<void> {
    await manager.transaction(async (transactionalEntityManager) => {
      const latestBlockKey =
        'crawl_transfer_' +
        this.networkToken.network.symbol +
        '_' +
        this._contract._address;

      let latestBlock = await transactionalEntityManager
        .createQueryBuilder(LatestBlock, 'block')
        .setLock('pessimistic_write')
        .where('block.key = :key', { key: latestBlockKey })
        .getOne();

      if (!latestBlock) {
        latestBlock = new LatestBlock();
        latestBlock.key = latestBlockKey;
      }

      latestBlock.blockNumber = toBlock;
      await transactionalEntityManager.save(latestBlock);
    });
  }

  /**
   * @param {any} event
   * Description: Crawl data and save it to the database
   */
  private async handleTransferEvent(event: any): Promise<void> {
    const { blockNumber, returnValues, transactionHash, address } = event;
    const { from, to, value } = returnValues;

    const block = await this._web3.eth.getBlock(blockNumber);
    const { timestamp } = block;

    await this.dataSource.transaction(async (manager) => {
      const [tokenExist] = await this.getTokensFromCache(manager, address);

      if (tokenExist) {
        const transferExist = await getFromCache(
          `transfer_${event.transactionHash}_${event.blockNumber}`,
          async () => {
            return manager.findOne(Transaction, {
              where: {
                transactionHash,
                blockTimestamp: timestamp,
              },
              select: ['id'],
            });
          },
        );

        if (!transferExist) {
          await manager.save(Transaction, {
            fromAddress: from,
            toAddress: to,
            value,
            blockTimestamp: timestamp,
            blockNumber,
            transactionHash,
            token: tokenExist,
          });
        }

        await this.updateLatestBlock(manager, blockNumber);
      }
    });
  }

  async fetchEvents(
    eventName: string,
    fromBlock: number,
    toBlock: number | string,
  ): Promise<any[]> {
    return await this._contract.getPastEvents(eventName, {
      fromBlock: fromBlock ?? this.networkToken.token.beginningBlock,
      toBlock,
    });
  }

  async handleEventsInBatches(events: any[]): Promise<void> {
    const batches = [];
    for (let i = 0; i < events.length; i += BATCH_SIZE) {
      batches.push(events.slice(i, i + BATCH_SIZE));
    }

    const promises = batches.map((batch) => this.handleEventsBatch(batch));
    await Promise.all(promises);
  }

  async handleEventsBatch(events: any[]): Promise<void> {
    const transferPromises = events.map((event) =>
      limit(() => this.handleTransferEvent(event)),
    );
    await Promise.all(transferPromises);
  }

  private async getTokensFromCache(
    manager: EntityManager,
    tokenAddress: string,
    // NOTE: Add more params
  ): Promise<[Token]> {
    const tokenKey = `token_${tokenAddress}`;

    // NOTE: Get more tokens
    const [tokenExist] = await Promise.all([
      getFromCache(tokenKey, async () => {
        return manager.findOne(Token, {
          where: { contractAddress: tokenAddress, isActive: true },
          select: ['id'],
        });
      }),
    ]);

    // NOTE: Return more tokens
    return [tokenExist];
  }

  stop() {
    // Stop listening for events from the WebSocket protocol
    this._contract.events.Transfer.removeAllListeners();

    // Close the WebSocket connection
    const provider = this._web3.currentProvider as WebsocketProvider;
    provider.disconnect();

    // Clear caches
    // removeFromCache(`token_${this._contractAddress}`);
    // const latestBlockKey = `crawl_transfer_${this.networkToken.network.symbol}_${this._contractAddress}`;
    // removeFromCache(latestBlockKey);

    logger.info(
      `Stopped CrawlTokenService for: ${this.networkToken.network.name}`,
    );
  }
}
