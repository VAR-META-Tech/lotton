import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

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
