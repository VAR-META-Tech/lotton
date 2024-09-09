import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from '@ton/core';
import { TonClient } from '@ton/ton';
// import cron from 'node-cron';
import { Repository } from 'typeorm';

import type { StellaConfig } from '@/configs';
import {
  LatestBlock,
  Pool,
  PoolPrize,
  PoolRound,
  Prizes,
  Token,
  TokenPrice,
  Transaction,
  UserTicket,
} from '@/database/entities';

import { TokenPriceService } from '../services/token_price.service';
import { CrawlWorkerService } from './crawl.service';
import { CrawlTokenPriceService } from './crawl_token_price.service';
import { RoundPrizesService } from './round_prizes.service';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(LatestBlock)
    private readonly latestBlockRepository: Repository<LatestBlock>,
    private readonly configService: ConfigService<StellaConfig>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    @InjectRepository(UserTicket)
    private readonly userTicketRepository: Repository<UserTicket>,
    @InjectRepository(PoolRound)
    private readonly poolRoundRepository: Repository<PoolRound>,
    @InjectRepository(Pool)
    private readonly poolRepository: Repository<Pool>,
    @InjectRepository(Prizes)
    private readonly prizesRepository: Repository<Prizes>,
    @InjectRepository(TokenPrice)
    private readonly tokenPriceRepository: Repository<TokenPrice>,
    private readonly tokenPriceService: TokenPriceService,
    @InjectRepository(PoolPrize)
    private readonly poolPrizeRepository: Repository<PoolPrize>,
    @Inject('GAME_CONTRACT')
    private readonly gameContractAddress?: Address,
    @Inject('TON_CLIENT')
    private readonly tonClient?: TonClient,
  ) {
    this.init();
    this.crawlToken();
    // this.syncData();
    // cron.schedule('* * * * *', async () => {
    //   this.syncData();
    // });
  }

  async init() {
    while (true) {
      await new CrawlWorkerService(
        this.latestBlockRepository,
        this.configService,
        this.transactionRepository,
        this.tokenRepository,
        this.userTicketRepository,
        this.poolRoundRepository,
        this.poolRepository,
        this.prizesRepository,
        this.poolPrizeRepository,
        this.gameContractAddress,
        this.tonClient,
      ).doCrawlJob();
      await this.wait(10000); // 10 seconds
    }
  }

  async syncData() {
    await new RoundPrizesService(
      this.poolRepository,
      this.poolRoundRepository,
      this.configService,
      this.userTicketRepository,
    );
  }

  async crawlToken() {
    const tokens = await this.tokenRepository.findBy({
      isActive: true,
    });

    await Promise.allSettled([
      tokens.map(
        (token) =>
          new CrawlTokenPriceService(
            token,
            this.tokenPriceRepository,
            this.tokenPriceService,
          ),
      ),
    ]);
  }

  wait(timeout: number) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  }
}
