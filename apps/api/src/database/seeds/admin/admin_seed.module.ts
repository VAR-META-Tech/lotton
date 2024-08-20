import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Admin } from '@/database/entities';

import { AdminSeedService } from './admin_seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  providers: [AdminSeedService],
  exports: [AdminSeedService],
})
export class AdminSeedModule {}
