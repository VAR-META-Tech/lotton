import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { CommonQuery } from '@/shared/dto/common.query';

export class QueryTokenPriceDto extends CommonQuery {
  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  tokenId?: number;

  @ApiProperty({ required: false, description: 'Search by name or symbol' })
  @IsOptional()
  @IsString()
  search?: string;
}
