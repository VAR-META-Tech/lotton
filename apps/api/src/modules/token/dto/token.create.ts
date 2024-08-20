import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { IsAddress } from '@/common/decorators/is_address.decorator';
import { FileDto } from '@/shared/dto/file.dto';

export class CreateTokenDto extends FileDto {
  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ type: Number, required: false })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  decimals: number;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  symbol: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @IsAddress()
  contractAddress: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  abi: string;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  beginningBlock: number;

  @ApiProperty({ type: Boolean, required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;
}
