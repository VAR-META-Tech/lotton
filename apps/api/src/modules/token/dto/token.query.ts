import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

import { CommonQuery } from '@/shared/dto/common.query';

export class QueryTokenDto extends CommonQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  contractAddress?: string;

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
