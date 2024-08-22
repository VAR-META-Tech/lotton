import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PoolRound } from '@/database/entities';

@Injectable()
export class PoolRoundService {
  constructor(
    @InjectRepository(PoolRound)
    private readonly roundRepository: Repository<PoolRound>,
  ) {}
  async deleteRoundsFromTime(poolId: number, fromTime: Date) {
    try {
      await this.roundRepository
        .createQueryBuilder('pool_round')
        .delete()
        .from(PoolRound)
        .where('pool_round.poolId = :poolId', { poolId })
        .andWhere('pool_round.startTime >= :fromTime', { fromTime })
        .execute();
    } catch (error) {
      throw error;
    }
  }

  async create(poolRound: PoolRound) {
    await this.roundRepository.save(poolRound);
  }

  async countOnGoing(poolId: number): Promise<number> {
    return await this.roundRepository
      .createQueryBuilder()
      .where('poolId = :poolId', { poolId })
      .andWhere('startTime <= NOW()')
      .getCount();
  }

  async deleteRoundGreaterRoundNumber(poolId: number, fromRoundNumber: number) {
    try {
      await this.roundRepository
        .createQueryBuilder()
        .delete()
        .from(PoolRound)
        .where('poolId = :poolId', { poolId })
        .andWhere('roundNumber >= :fromRoundNumber', {
          fromRoundNumber,
        })
        .execute();
    } catch (error) {
      throw error;
    }
  }

  async softDelete(poolId: number) {
    try {
      await this.roundRepository
        .createQueryBuilder()
        .softDelete()
        .from(PoolRound)
        .where('poolId = :poolId', { poolId })
        .execute();
    } catch (error) {
      throw error;
    }
  }
}
