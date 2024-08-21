import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { PoolStatusEnum } from '@/shared/enums';

export class PoolQueryDto {
  @ApiProperty({
    description: 'status',
    example: PoolStatusEnum.UPCOMING,
    required: false,
  })
  @IsOptional()
  @IsEnum(PoolStatusEnum)
  status?: PoolStatusEnum;

  @ApiProperty({
    description: 'search',
    example: 'pool',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;
}
