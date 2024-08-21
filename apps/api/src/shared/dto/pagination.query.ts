import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class QueryPaginationDto {
  @ApiProperty({
    required: false,
    type: Number,
    description: 'Page size for pagination',
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  pageSizes?: number;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  page?: number;
}
