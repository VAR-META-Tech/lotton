import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { User } from '@/database/entities';
import { PoolRound, Prizes, UserTicket } from '@/database/entities';
import type { QueryPaginationDto } from '@/shared/dto/pagination.query';
import { PoolRoundStatusEnum } from '@/shared/enums';
import { FetchType, paginateEntities } from '@/utils/paginate';

import type { RoundQueryDto } from './dto/round.query.dto';

@Injectable()
export class RoundService {
  constructor(
    @InjectRepository(PoolRound)
    private readonly roundRepository: Repository<PoolRound>,
    @InjectRepository(UserTicket)
    private readonly userTicketRepository: Repository<UserTicket>,
  ) {}
  async findRounds(query: RoundQueryDto, pagination: QueryPaginationDto) {
    try {
      const { status, search, poolId } = query;
      const queryBuilder = this.roundRepository
        .createQueryBuilder('poolRound')
        .leftJoin('poolRound.pool', 'pool')
        .leftJoin('pool.currency', 'currency')
        .leftJoin(
          Prizes,
          'prizes',
          'prizes.poolIdOnChain = pool.poolIdOnChain AND prizes.roundIdOnchain = poolRound.roundIdOnchain',
        )
        .select([
          'poolRound.*',
          'pool.name as poolName',
          'currency.symbol as symbol',
          '(CASE WHEN prizes.totalPrizes IS NOT NULL AND prizes.totalPrizes > 0 THEN prizes.totalPrizes ELSE 0 END) as prizePool',
        ]);

      if (search) {
        queryBuilder.andWhere('poolRound.winningCode LIKE :search ', {
          search: `%${search}%`,
        });
      }
      if (poolId) {
        queryBuilder.andWhere('poolRound.poolId = :poolId', { poolId });
      }
      if (status && status == PoolRoundStatusEnum.UPCOMING) {
        queryBuilder.andWhere('poolRound.startTime > UNIX_TIMESTAMP(NOW())');
      }
      if (status && status == PoolRoundStatusEnum.ONGOING) {
        queryBuilder.andWhere(
          'poolRound.startTime < UNIX_TIMESTAMP(NOW()) AND poolRound.endTime > UNIX_TIMESTAMP(NOW())',
        );
      }
      if (status && status == PoolRoundStatusEnum.CLOSED) {
        queryBuilder.andWhere('poolRound.endTime < UNIX_TIMESTAMP(NOW())');
      }
      if (status && status == PoolRoundStatusEnum.DELETE) {
        queryBuilder.andWhere('poolRound.deletedAt IS NOT NULL').withDeleted();
      }

      return await paginateEntities<PoolRound>(
        queryBuilder,
        pagination,
        FetchType.RAW,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const poolRound = await this.roundRepository
        .createQueryBuilder('poolRound')
        .leftJoin('poolRound.ticket', 'ticket')
        .leftJoin('poolRound.pool', 'pool')
        .where('poolRound.id = :poolRound', { poolRound: id })
        .select([
          'poolRound.id as id',
          'poolRound.roundNumber as roundNumber',
          'poolRound.startTime as startTime',
          'poolRound.endTime as endTime',
          'poolRound.winningCode as winningCode',
          'poolRound.createdAt as createdAt',
          'poolRound.updatedAt as updatedAt',
          '"COUNT(ticket.id)" * 1 as totalTickets',
          '"COUNT(DISTINCT ticket.userWallet)" * 1 as totalUsers',
          'poolRound.winningCode AS winningCode',
          '"COUNT(ticket.id)" * pool.ticketPrice as currentPrizes',
          '"0" * 1 as previousPrizes', // TODO : calculate previous prizes
        ])
        .groupBy('poolRound.id')
        .getRawOne();
      if (!poolRound) {
        throw new BadRequestException('round not found');
      }

      console.log('prizes', await this.getPrizes(id));

      return poolRound;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getPrizes(roundId: number) {
    try {
      const poolPrizes = await this.roundRepository
        .createQueryBuilder('round')
        .leftJoin('round.pool', 'pool')
        .leftJoin('pool.poolPrizes', 'poolPrizes')
        .leftJoin('round.ticket', 'ticket')
        .where('round.id = :roundId', { roundId })
        .select([
          'poolPrizes.id as id',
          'poolPrizes.matchNumber as matchNumber',
          'poolPrizes.allocation as allocation',
          'poolPrizes.createdAt as createdAt',
          'poolPrizes.updatedAt as updatedAt',
          '"COUNT(ticket.id)" * pool.ticketPrice * poolPrizes.allocation / 100 as amount',
        ])
        .groupBy('poolPrizes.id')
        .getRawMany();

      return poolPrizes;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async totalTickets(roundId: number, user: User) {
    const [_, total] = await this.userTicketRepository.findAndCountBy({
      round: {
        id: roundId,
      },
      userWallet: user.wallet,
    });
    return total;
  }
}
