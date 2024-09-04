import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { StellaConfig } from '@/configs';
import {
  LatestBlock,
  Pool,
  PoolRound,
  Prizes,
  Token,
  Transaction,
  UserTicket,
} from '@/database/entities';

import { CrawlWorkerService } from './crawl.service';
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
  ) {
    // this.syncData();
    this.init();
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
      ).doCrawlJob();
      await this.wait(15000); // 15 seconds
    }
  }

  async syncData() {
    await new RoundPrizesService(
      this.poolRepository,
      this.poolRoundRepository,
      this.configService,
    );
  }

  wait(timeout: number) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  }
}
