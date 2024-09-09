import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

import { CommonQuery } from '@/shared/dto/common.query';
import { TransactionType } from '@/shared/enums';

export class QueryTransactionDto extends CommonQuery {
  @ApiProperty({
    description: 'token id',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  tokenId?: number;

  @ApiProperty({
    description: `value: ${TransactionType.BUY}|${TransactionType.CLAIM}`,
    required: false,
  })
  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;
}
