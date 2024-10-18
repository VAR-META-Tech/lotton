import type { ScheduledTask } from 'node-cron';
import cron from 'node-cron';
import type { Repository } from 'typeorm';

import type { Token } from '@/database/entities';
import { TokenPrice } from '@/database/entities';
import { getLogger } from '@/utils/logger';

import type { TokenPriceService } from '../services/token_price.service';

const logger = getLogger('CrawlTokenPriceService');

export class CrawlTokenPriceService {
  private cronTask: ScheduledTask;
  constructor(
    private token: Token,
    private tokenPriceRepository: Repository<TokenPrice>,
    private tokenPriceService: TokenPriceService,
  ) {
    this.init();
  }

  async init() {
    this.handleCron();
  }

  // Every minute
  handleCron() {
    this.cronTask = cron.schedule('*/30 * * * *', async () => {
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
      if (!this.token.symbol) {
        throw new Error('Token symbol is missing');
      }

      const data = await this.tokenPriceService.getPrice(
        this.token.symbol,
        'USD',
      );

      if (data) {
        await this.tokenPriceRepository
          .createQueryBuilder()
          .insert()
          .into(TokenPrice)
          .values({
            id: null,
            token: this.token,
            price: data.rates[this.token.symbol].prices.USD.toString(),
          })
          .orUpdate(['price'], ['tokenId'])
          .execute();

        logger.info(
          `Crawl Token Price Success: ${this.token.name} ${
            data.rates[this.token.symbol].prices.USD
          } $`,
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
