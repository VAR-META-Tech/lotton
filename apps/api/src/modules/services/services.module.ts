import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { RedisService } from './redis.service';
import { TelegramService } from './telegram.service';
import { TokenPriceService } from './token_price.service';

@Module({
  imports: [HttpModule],
  providers: [RedisService, TokenPriceService, TelegramService],
  exports: [RedisService, TokenPriceService, TelegramService],
})
export class ServicesModule {}
