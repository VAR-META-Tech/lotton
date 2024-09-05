import type { ScheduledTask } from 'node-cron';
import cron from 'node-cron';
import type { DataSource } from 'typeorm';

import { PoolRound, UserTicket } from '@/database/entities';
import { getLogger } from '@/utils/logger';
import { checkTicketWinner } from '@/utils/winer_code';

import type { CrawlTokenService } from './crawl_token.service';

const logger = getLogger('WinnerTicketService');

export class WinnerTicketService {
  private cronTask: ScheduledTask;
  constructor(
    private dataSource: DataSource,
    private tokenService: CrawlTokenService,
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
        await this.crawlTicketWinner();
      } catch (error) {
        logger.error('Init Crawl Winner Ticket Worker Error: ');
        logger.error(error);
      }
    });
  }

  async crawlTicketWinner() {
    try {
      const data = await this.dataSource.transaction(async (manager) => {
        const roundEnds = await manager
          .createQueryBuilder(PoolRound, 'poolRound')
          .where('poolRound.endTime <= UNIX_TIMESTAMP(NOW())')
          .andWhere('poolRound.winningCode IS NULL')
          .getMany();

        const latestBlock = await this.tokenService.getLatestBlock();
        await Promise.all(
          roundEnds.map(async (roundEnd) => {
            roundEnd.winningCode = `${latestBlock}`;
            await manager.save(PoolRound, roundEnd);
            const userTickets = await manager
              .createQueryBuilder(UserTicket, 'userTicket')
              .where('userTicket.roundId = :roundId', { roundId: roundEnd.id })
              .getMany();

            const winningCode = roundEnd.winningCode.substring(
              roundEnd.winningCode.length - 4,
              roundEnd.winningCode.length,
            );

            if (userTickets.length > 0) {
              await Promise.all(
                userTickets.map(async (userTicket) => {
                  const match = checkTicketWinner(userTicket.code, winningCode);
                  userTicket.winningCode = winningCode;
                  userTicket.winningMatch = match;
                  await manager.save(UserTicket, userTicket);
                }),
              );
            }
          }),
        );
      });

      logger.info(`Crawl Winner Ticket Success: ${data} `);
    } catch (error) {
      throw new Error(error);
    }
  }

  stop() {
    if (this.cronTask) {
      this.cronTask.stop();
      logger.info('Crawl Winner Ticket Worker stopped.');
    }
  }
}
