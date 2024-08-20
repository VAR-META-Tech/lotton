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

import { FileDto } from '@/shared/dto/file.dto';

export class CreateNetworkDto extends FileDto {
  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  chainId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  symbol: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  scanAPI: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  rpcEndpoint: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  explorerEndpoint: string;

  @ApiProperty({ type: Boolean, required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;
}
