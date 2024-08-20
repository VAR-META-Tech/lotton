import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LatestBlock, Network, NetworkToken, Token } from '@/database/entities';

import { ServicesModule } from '../services/services.module';
import { ManagerService } from './manager.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LatestBlock, Network, Token, NetworkToken]),
    ServicesModule,
  ],
  providers: [ManagerService],
})
export class WorkerModule {}
