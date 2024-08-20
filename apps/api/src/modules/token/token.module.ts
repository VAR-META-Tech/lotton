import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Token } from '@/database/entities';

import { FileModule } from '../file/file.module';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';

@Module({
  imports: [TypeOrmModule.forFeature([Token]), FileModule],
  providers: [TokenService],
  controllers: [TokenController],
})
export class TokenModule {}
