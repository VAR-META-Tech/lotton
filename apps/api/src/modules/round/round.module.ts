import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Pool, PoolPrize, PoolRound } from '@/database/entities';

import { RoundController } from './round.controller';
import { RoundService } from './round.service';

@Module({
  imports: [TypeOrmModule.forFeature([PoolRound, Pool, PoolPrize])],
  controllers: [RoundController],
  providers: [RoundService],
})
export class RoundModule {}
