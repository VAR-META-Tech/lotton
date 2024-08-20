import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { ScheduledTask } from 'node-cron';
import cron from 'node-cron';
import { DataSource, Repository } from 'typeorm';

import { NetworkToken } from '@/database/entities';
import { getFromCache } from '@/utils/cache';
import { getLogger } from '@/utils/logger';

import { TokenPriceService } from '../services/token_price.service';
import { CrawlTokenService } from './crawl_token.service';
import { CrawlTokenPriceService } from './crawl_token_price.service';

const logger = getLogger('ManagerService');

@Injectable()
export class ManagerService {
  private crawlTokenServices: CrawlTokenService[] = [];
  private crawlTokenPriceServices: CrawlTokenPriceService[] = [];
  private cronJob: ScheduledTask;

  constructor(
    @InjectRepository(NetworkToken)
    private readonly networkTokenRepository: Repository<NetworkToken>,
    private readonly dataSource: DataSource,
    private readonly tokenPriceService: TokenPriceService,
  ) {
    this.init();
    this.startCronJob();
  }

  // Every hour
  startCronJob() {
    this.cronJob = cron.schedule('0 0 * * * *', async () => {
      await this.init(); // Synchronize with database
    });
  }

  async init() {
    await this.initNetworkToken();
  }

  private async initNetworkToken() {
    const NetworkTokens = await this.networkTokenRepository.find({
      relations: ['token', 'network'],
    });

    logger.info(
      `Init Networks: ${NetworkTokens.map((n) => n.network.name).join(', ')}`,
    );

    for (const networkToken of NetworkTokens) {
      logger.info(`Init Currency: ${networkToken.token.name}`);

      const runCrawlTokenService = async () => {
        if (networkToken.token.contractAddress) {
          const oldNetworkToken = await getFromCache(
            networkToken.token.contractAddress,
            () => Promise.resolve(null),
          );
          if (oldNetworkToken !== networkToken.token.contractAddress) {
            this.crawlTokenServices.forEach((service) => service.stop());
            this.crawlTokenServices = [];
            this.crawlTokenServices.push(
              new CrawlTokenService(networkToken, this.dataSource),
            );
            logger.info(
              `Starting CrawlTokenService for: ${networkToken.network.name}`,
            );
          }
        }
      };

      const runCrawlTokenPriceService = async () => {
        if (networkToken.token.contractAddress) {
          const oldNetworkToken = await getFromCache(
            networkToken.token.contractAddress,
            () => Promise.resolve(null),
          );
          if (oldNetworkToken !== networkToken.token.contractAddress) {
            this.crawlTokenPriceServices.forEach((service) => service.stop());
            this.crawlTokenPriceServices = [];
            this.crawlTokenPriceServices.push(
              new CrawlTokenPriceService(
                networkToken,
                this.dataSource,
                this.tokenPriceService,
              ),
            );
            logger.info(
              `Starting CrawlTokenPriceService for: ${networkToken.network.name}`,
            );
          }
        }
      };

      // TODO: Run this
      this.runWorker(runCrawlTokenService);
      // this.runWorker(runCrawlTokenPriceService);
    }
  }

  private runWorker(_callback: () => void): void {
    try {
      _callback();
    } catch (error) {
      logger.error(error);
    }
  }

  private stopCronJob() {
    if (this.cronJob) {
      this.cronJob.stop();
      logger.info('Cron job stopped.');
    }
  }
}
