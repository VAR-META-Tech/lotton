import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { PoolRoundStatusEnum } from '@/shared/enums';

export class PoolQueryDto {
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
    example: 'pool',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;
}

export enum UserPoolType {
  JOINED = 'joined',
  WINNER = 'winner',
}

export class UserPoolDto {
  @ApiProperty({
    default: UserPoolType.JOINED,
    description: `value: ${UserPoolType.JOINED}|${UserPoolType.WINNER}`,
    required: false,
  })
  @IsEnum(UserPoolType)
  @IsOptional()
  type?: UserPoolType;
}

export class ClaimDto {
  @ApiProperty({
    description: 'Pool id',
    required: false,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  poolId: number;

  @ApiProperty({
    description: 'Round id',
    required: false,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  roundId: number;
}
