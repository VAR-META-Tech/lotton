import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class QueryTokenPriceDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  tokenId?: number;
}
