import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ValidateUserByPasswordDto {
  @ApiProperty({ required: true, example: '0x1234567890' })
  @IsEmail()
  @IsNotEmpty()
  wallet: string;

  @ApiProperty({ required: true, example: '123456' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
