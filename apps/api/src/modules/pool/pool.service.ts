import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Repository } from 'typeorm';

import { Pool, PoolPrize, PoolRound, Token } from '@/database/entities';
import type { QueryPaginationDto } from '@/shared/dto/pagination.query';
import { PoolStatusEnum } from '@/shared/enums';
import { FetchType, paginateEntities } from '@/utils/paginate';

import type { CreatePoolDto } from './dto/create-pool.dto';
import type { PoolQueryDto } from './dto/get-pool.query';

export class PoolService {
  constructor(
    @InjectRepository(Pool) private readonly poolRepository: Repository<Pool>,
    @InjectRepository(PoolRound)
    private readonly roundRepository: Repository<PoolRound>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    @InjectRepository(PoolPrize)
    private readonly poolPrizesRepository: Repository<PoolPrize>,
  ) {}
  async create(createPoolDto: CreatePoolDto) {
    try {
      const pool = new Pool();
      pool.name = createPoolDto.name;
      pool.currency = await this.tokenRepository.findOne({
        where: { id: +createPoolDto.currency },
      });
      pool.sequency = createPoolDto.sequency;
      pool.totalRounds = createPoolDto.totalRounds;
      pool.startTime = createPoolDto.startTime;
      pool.ticketPrice = createPoolDto.ticketPrice;
      pool.endTime = dayjs(createPoolDto.startTime)
        .add(createPoolDto.sequency * createPoolDto.totalRounds, 'days')
        .toDate();

      await this.poolRepository.save(pool);

      let startTime = createPoolDto.startTime;
      for (let i = 1; i < createPoolDto.totalRounds; i++) {
        const endTime = dayjs(startTime)
          .add(createPoolDto.sequency, 'days')
          .toDate();
        const round = new PoolRound();
        round.startTime = dayjs(startTime).toDate();
        round.endTime = endTime;
        round.pool = pool;
        round.roundNumber = i;
        await this.roundRepository.save(round);
        startTime = endTime;
      }
      const poolPrizes = createPoolDto.poolPrizes.map((poolDto) => {
        const poolPrize = new PoolPrize();
        poolPrize.pool = pool;
        poolPrize.matchNumber = poolDto.matchNumber;
        poolPrize.allocation = poolDto.allocation;
        return poolPrize;
      });
      await this.poolPrizesRepository.save(poolPrizes);

      return pool;
    } catch (error) {
      throw error;
    }
  }

  async find(pagination: QueryPaginationDto, query: PoolQueryDto) {
    try {
      const { status, search } = query;
      const queryBuilder = this.poolRepository.createQueryBuilder('pool');

      if (search) {
        queryBuilder.andWhere('pool.name LIKE :search ', {
          search: `%${search}%`,
        });
      }
      if (status && status == PoolStatusEnum.UPCOMING) {
        queryBuilder.andWhere('pool.startTime > NOW()');
      }
      if (status && status == PoolStatusEnum.ONGOING) {
        queryBuilder.andWhere(
          'pool.startTime < NOW() AND pool.endTime > NOW()',
        );
      }
      if (status && status == PoolStatusEnum.CLOSED) {
        queryBuilder.andWhere('pool.endTime < NOW()');
      }
      if (status && status == PoolStatusEnum.DELETE) {
        queryBuilder.andWhere('pool.deletedAt IS NOT NULL').withDeleted();
      }

      return await paginateEntities<Pool>(
        queryBuilder,
        pagination,
        FetchType.MANAGED,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findOne(id: number) {
    try {
      const pool = this.poolRepository
        .createQueryBuilder('pool')
        .leftJoinAndSelect('pool.rounds', 'rounds')
        .leftJoinAndSelect('pool.poolPrizes', 'prizes')
        .where('pool.id = :poolId', { poolId: id })
        .getOne();
      return pool;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
