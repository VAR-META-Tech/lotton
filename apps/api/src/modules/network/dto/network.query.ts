import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

import { CommonQuery } from '@/shared/dto/common.query';

export class QueryNetworkDto extends CommonQuery {
  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  chainId?: number;

  @ApiProperty({ required: false, description: 'Search by name or symbol' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;
}
