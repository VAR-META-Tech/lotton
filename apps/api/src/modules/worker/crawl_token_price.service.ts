import type { ScheduledTask } from 'node-cron';
import cron from 'node-cron';
import type { DataSource } from 'typeorm';

import { type NetworkToken, TokenPrice } from '@/database/entities';
import { getLogger } from '@/utils/logger';

import type { TokenPriceService } from '../services/token_price.service';

const logger = getLogger('CrawlTokenPriceService');

export class CrawlTokenPriceService {
  private cronTask: ScheduledTask;
  constructor(
    private networkToken: NetworkToken,
    private dataSource: DataSource,
    private tokenPriceService: TokenPriceService,
  ) {
    this.init();
  }

  async init() {
    this.handleCron();
  }

  // Every minute
  handleCron() {
    this.cronTask = cron.schedule('* * * * *', async () => {
      try {
        await this.crawlTokenPrice();
      } catch (error) {
        logger.error('Init Crawl Token Price Worker Error: ');
        logger.error(error);
      }
    });
  }

  async crawlTokenPrice() {
    try {
      const data = await this.tokenPriceService.getPrice(
        this.networkToken.token.symbol,
        'USDT',
      );

      if (data) {
        await this.dataSource.transaction(async (manager) => {
          await manager.save(TokenPrice, {
            token: this.networkToken.token,
            price: data.last,
          });
        });

        logger.info(
          `Crawl Token Price Success: ${this.networkToken.token.name} ${data.last} $`,
        );
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  stop() {
    if (this.cronTask) {
      this.cronTask.stop();
      logger.info('Crawl Token Price Worker stopped.');
    }
  }
}
