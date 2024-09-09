import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { RedisService } from './redis.service';
import { TokenPriceService } from './token_price.service';

@Module({
  imports: [HttpModule],
  providers: [RedisService, TokenPriceService],
  exports: [RedisService, TokenPriceService],
})
export class ServicesModule {}
