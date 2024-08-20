import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NetworkToken, Token } from '@/database/entities';

import { TokenSeedService } from './token_seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Token, NetworkToken])],
  providers: [TokenSeedService],
  exports: [TokenSeedService],
})
export class TokenSeedModule {}
