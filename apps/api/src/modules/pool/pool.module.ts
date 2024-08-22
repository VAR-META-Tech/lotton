import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Pool, PoolPrize, PoolRound, Token } from '@/database/entities';

import { PoolRoundModule } from '../poolRound/poolRound.module';
import { PoolRoundService } from '../poolRound/poolRound.service';
import { PoolController } from './pool.controller';
import { PoolService } from './pool.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pool, PoolRound, Token, PoolPrize]),
    PoolRoundModule,
  ],
  controllers: [PoolController],
  providers: [PoolService, PoolRoundService],
})
export class PoolModule {}
