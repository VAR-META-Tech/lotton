import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { PoolRoundStatusEnum } from '@/shared/enums';

export class RoundQueryDto {
  @ApiProperty({
    description: 'status',
    example: PoolRoundStatusEnum.UPCOMING,
    required: false,
  })
  @IsOptional()
  @IsEnum(PoolRoundStatusEnum)
  status?: PoolRoundStatusEnum;

  @ApiProperty({
    description: 'search',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'poolId',
    required: false,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  poolId?: number;
}

export class WinningTicketQueryDto {
  @ApiProperty({
    description: 'roundId',
    required: true,
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @Type(() => Number)
  roundId?: number;

  @ApiProperty({
    description: 'roundId',
    required: false,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  matchNumber?: number;
}
