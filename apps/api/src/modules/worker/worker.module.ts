import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  LatestBlock,
  Network,
  NetworkToken,
  Token,
  TokenPrice,
} from '@/database/entities';

import { ServicesModule } from '../services/services.module';
import { ManagerService } from './manager.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Network,
      Token,
      NetworkToken,
      TokenPrice,
      LatestBlock,
    ]),
    ServicesModule,
  ],
  providers: [ManagerService],
  exports: [ManagerService],
})
export class WorkerModule {}
