import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { QueryBinanceTokenPriceDto } from '../token_price/dto/binance_token_price.query';
import { QueryTFTokenPriceDto } from '../token_price/dto/tf_token_price.query';
import { BinanceService } from './binance.service';
import { TFService } from './tf.service';

@ApiTags('quant-trading')
@Controller('quant-trading')
export class QuantTradingController {
  constructor(
    private readonly tfService: TFService,
    private readonly binanceService: BinanceService,
  ) {}

  @Get('tf/predict-next-price')
  async tfPredictNextPrice(
    @Query() query?: QueryTFTokenPriceDto,
  ): Promise<{ price: number; time: string }> {
    return await this.tfService.predictNextPrice(query);
  }

  @Get('binance/predict-next-price')
  async binancePredictNextPrice(
    @Query() query?: QueryBinanceTokenPriceDto,
  ): Promise<{ price: number; time: string }> {
    return await this.binanceService.predictNextPrice(query);
  }
}
