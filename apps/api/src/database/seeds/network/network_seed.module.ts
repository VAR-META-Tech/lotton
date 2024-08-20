import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Network } from '@/database/entities';

import { NetworkSeedService } from './network_seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Network])],
  providers: [NetworkSeedService],
  exports: [NetworkSeedService],
})
export class NetworkSeedModule {}
