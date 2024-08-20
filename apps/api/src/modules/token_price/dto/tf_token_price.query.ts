import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

import { CommonQuery } from '@/shared/dto/common.query';

export class QueryTFTokenPriceDto extends CommonQuery {
  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  tokenId?: number;
}
