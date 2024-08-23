import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { IsDate } from '@/common/decorators/is_date.decorator';
import { IsFeatured } from '@/common/decorators/is_featured.decorator';
import { IsGreaterThan } from '@/common/decorators/is_greater_than.decorator';
import { SumValueArray } from '@/common/decorators/sum_value.decorator';

export class PoolPrizes {
  @ApiProperty({
    required: true,
    description: 'match number',
    example: 1,
    maximum: 4,
    minimum: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Max(4)
  @Min(1)
  @Type(() => Number)
  matchNumber: number;

  @ApiProperty({
    required: true,
    description: 'allocation number',
    example: 10,
    maximum: 100,
    minimum: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Max(100)
  @Min(1)
  @Type(() => Number)
  allocation: number;
}

export class CreatePoolDto {
  @ApiProperty({ required: true, example: 'pool name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true, description: 'currency id', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Min(1)
  currency: number;

  @ApiProperty({
    required: true,
    description: 'start time',
    example: new Date(),
  })
  @IsDate()
  @IsFeatured()
  @IsNotEmpty()
  startTime: Date;

  @ApiProperty({ required: true, description: 'sequency days', example: 30 })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Min(1)
  sequency: number;

  @ApiProperty({ required: true, description: 'total round', example: 10 })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  totalRounds: number;

  @ApiProperty({ required: true, description: 'ticket price', example: 30 })
  @IsNumber()
  @IsNotEmpty()
  @IsGreaterThan(0)
  @Type(() => Number)
  ticketPrice: number;

  @ApiProperty({
    required: true,
    description: 'pool prizes',
    isArray: true,
    type: PoolPrizes,
    minLength: 4,
    maxLength: 4,
  })
  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  @Type(() => PoolPrizes)
  @IsNotEmpty()
  @SumValueArray<PoolPrizes>('allocation', 100)
  poolPrizes: PoolPrizes[];
}
