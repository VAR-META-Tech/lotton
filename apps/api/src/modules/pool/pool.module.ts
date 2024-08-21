import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Pool, PoolPrize, PoolRound, Token } from '@/database/entities';

import { PoolController } from './pool.controller';
import { PoolService } from './pool.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pool, PoolRound, Token, PoolPrize])],
  controllers: [PoolController],
  providers: [PoolService],
})
export class PoolModule {}
