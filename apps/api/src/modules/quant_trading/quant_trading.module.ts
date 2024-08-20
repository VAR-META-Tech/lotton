import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { TokenPriceModule } from '../token_price/token_price.module';
import { BinanceService } from './binance.service';
import { QuantTradingController } from './quant_trading.controller';
import { QuantTradingService } from './quant_trading.service';
import { TFService } from './tf.service';

@Module({
  imports: [TokenPriceModule, HttpModule],
  providers: [QuantTradingService, TFService, BinanceService],
  controllers: [QuantTradingController],
})
export class QuantTradingModule {}
