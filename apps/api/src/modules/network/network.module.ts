import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Network } from '@/database/entities';

import { FileModule } from '../file/file.module';
import { NetworkController } from './network.controller';
import { NetworkService } from './network.service';

@Module({
  imports: [TypeOrmModule.forFeature([Network]), FileModule],
  providers: [NetworkService],
  controllers: [NetworkController],
})
export class NetworkModule {}
