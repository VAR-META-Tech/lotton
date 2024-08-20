import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

import { IsAddress } from '@/common/decorators/is_address.decorator';

export class CreateWalletDto {
  @ApiProperty({
    minLength: 6,
    required: true,
    example: '0x62226C6d4B1a8347f42...',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @IsAddress()
  wallet: string;
}
