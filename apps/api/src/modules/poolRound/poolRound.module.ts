import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PoolRound } from '@/database/entities';

import { PoolRoundService } from './poolRound.service';

@Module({
  imports: [TypeOrmModule.forFeature([PoolRound])],
  controllers: [],
  providers: [PoolRoundService],
})
export class PoolRoundModule {}
