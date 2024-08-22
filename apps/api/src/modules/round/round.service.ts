import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { QueryPaginationDto } from '@/shared/dto/pagination.query';
import { PoolRoundStatusEnum } from '@/shared/enums';
import { FetchType, paginateEntities } from '@/utils/paginate';

import { PoolPrize, PoolRound } from '@/database/entities';
import { RoundQueryDto } from './dto/round.query.dto';

@Injectable()
export class RoundService {
  constructor(
    @InjectRepository(PoolRound)
    private readonly roundRepository: Repository<PoolRound>,
    @InjectRepository(PoolPrize)
    private readonly poolPrizeRepository: Repository<PoolPrize>,
  ) {}
  async findRounds(query: RoundQueryDto, pagination: QueryPaginationDto) {
    try {
      const { status, search, poolId } = query;
      const queryBuilder = this.roundRepository.createQueryBuilder('poolRound');

      if (search) {
        queryBuilder.andWhere('poolRound.winningHash LIKE :search ', {
          search: `%${search}%`,
        });
      }
      if (poolId) {
        queryBuilder.andWhere('poolRound.poolId = :poolId', { poolId });
      }
      if (status && status == PoolRoundStatusEnum.UPCOMING) {
        queryBuilder.andWhere('poolRound.startTime > NOW()');
      }
      if (status && status == PoolRoundStatusEnum.ONGOING) {
        queryBuilder.andWhere(
          'poolRound.startTime < NOW() AND poolRound.endTime > NOW()',
        );
      }
      if (status && status == PoolRoundStatusEnum.CLOSED) {
        queryBuilder.andWhere('poolRound.endTime < NOW()');
      }
      if (status && status == PoolRoundStatusEnum.DELETE) {
        queryBuilder.andWhere('poolRound.deletedAt IS NOT NULL').withDeleted();
      }

      return await paginateEntities<PoolRound>(
        queryBuilder,
        pagination,
        FetchType.MANAGED,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const poolRound = this.roundRepository
        .createQueryBuilder('poolRound')
        .leftJoin('poolRound.ticket', 'ticket')
        .leftJoin('ticket.user', 'user')
        .leftJoin('poolRound.pool', 'pool')
        .where('poolRound.id = :poolRound', { poolRound: id })
        .select([
          'poolRound.id as id',
          'poolRound.roundNumber as roundNumber',
          'poolRound.startTime as startTime',
          'poolRound.endTime as endTime',
          'poolRound.winningHash as winningHash',
          'poolRound.createdAt as createdAt',
          'poolRound.updatedAt as updatedAt',
          '"COUNT(ticket.id)" * 1 as totalTickets',
          '"COUNT(user.id)" * 1 as totalUsers',
          'reverse(substring(reverse(poolRound.winningHash), 1, 4)) AS winningCode',
          '"COUNT(ticket.id)" * pool.ticketPrice as currentPrizes',
          '"0" * 1 as previousPrizes', // TODO : calculate previous prizes
        ])
        .groupBy('poolRound.id')
        .getRawOne();

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
}
