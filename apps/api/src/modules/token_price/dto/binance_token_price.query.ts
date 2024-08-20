import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

import { BinanceIntervalEnum } from '@/shared/enums';

export class QueryBinanceTokenPriceDto {
  @ApiProperty({ required: false, example: 'BTCUSDT' })
  @IsNotEmpty()
  symbol: string;

  @ApiProperty({ required: false, type: 'enum', enum: BinanceIntervalEnum })
  @IsNotEmpty()
  @IsEnum(BinanceIntervalEnum)
  interval: BinanceIntervalEnum = BinanceIntervalEnum.ONE_WEEK;
}
