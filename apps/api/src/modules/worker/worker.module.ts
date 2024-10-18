import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '@ton/core';
import { TonClient } from '@ton/ton';

import {
  LatestBlock,
  Network,
  NetworkToken,
  Pool,
  PoolPrize,
  PoolRound,
  Prizes,
  Token,
  TokenPrice,
  Transaction,
  UserTicket,
} from '@/database/entities';

import { ServicesModule } from '../services/services.module';
import { ManagerService } from './manager.service';
import { CrawlPoolInactiveService } from './pool_inactive.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Network,
      Token,
      NetworkToken,
      TokenPrice,
      LatestBlock,
      Transaction,
      UserTicket,
      PoolRound,
      Pool,
      Prizes,
      PoolPrize,
    ]),
    ServicesModule,
  ],
  providers: [
    CrawlPoolInactiveService,
    ManagerService,
    {
      provide: 'GAME_CONTRACT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        Address.parse(
          configService.get('contract.gameContractAddress', {
            infer: true,
          }),
        ),
    },
    {
      provide: 'TON_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new TonClient({
          endpoint: configService.get('contract.rpcEndpoint', {
            infer: true,
          }),
          apiKey: configService.get('contract.apiKey', {
            infer: true,
          }),
        }),
    },
  ],
  exports: [ManagerService, CrawlPoolInactiveService],
})
export class WorkerModule {}
