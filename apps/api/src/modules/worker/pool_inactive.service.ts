import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import cron from 'node-cron';
import { DataSource } from 'typeorm';

import { Pool, PoolPrize } from '@/database/entities';
import { PoolStatusEnum } from '@/shared/enums';
import { getLogger } from '@/utils/logger';

const logger = getLogger('CrawlPoolInactiveService');

@Injectable()
export class CrawlPoolInactiveService {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    this.init();
  }

  async init() {
    this.handleCron();
  }

  // Every minute
  handleCron() {
    cron.schedule('0 0 1 * *', async () => {
      try {
        logger.info('CrawlPoolInactiveService');
        await this.crawlPoolInactive();
      } catch (error) {
        logger.error('Init Crawl Pool inactive Worker Error: ');
        logger.error(error);
      }
    });
  }

  async crawlPoolInactive() {
    try {
      const data = await this.dataSource.transaction(async (manager) => {
        const poolInactive = await manager
          .createQueryBuilder(Pool, 'pool')
          .where('pool.endTime <= UNIX_TIMESTAMP(NOW())')
          .andWhere('pool.status = :status', {
            status: PoolStatusEnum.INACTIVE,
          })
          .getMany();
        logger.info(`Pool to delete`);
        console.info(poolInactive);
        if (poolInactive.length == 0) return 0;
        const data = await manager
          .createQueryBuilder(Pool, 'pool')
          .where('pool.id IN (:...poolIds)', {
            poolIds: poolInactive.map(({ id }) => id),
          })
          .andWhere('pool.status = :status', {
            status: PoolStatusEnum.INACTIVE,
          })
          .delete()
          .execute();
        await manager
          .createQueryBuilder(PoolPrize, 'poolPrizes')
          .where('pool.id IN (:...poolIds)', {
            poolIds: poolInactive.map(({ id }) => id),
          })
          .delete()
          .execute();
        console.log({ data });

        return data.affected;
      });

      logger.info(`Crawl Pool inactive Success: ${data} `);
    } catch (error) {
      throw new Error(error);
    }
  }
}
