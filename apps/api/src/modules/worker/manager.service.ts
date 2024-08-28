import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { StellaConfig } from '@/configs';
import {
  LatestBlock,
  PoolRound,
  Token,
  Transaction,
  UserTicket,
} from '@/database/entities';

import { CrawlWorkerService } from './crawl.service';

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
  ) {
    this.init();
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
      ).doCrawlJob();
      await this.wait(5000); // 5 seconds
    }
  }
  wait(timeout: number) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  }
}
