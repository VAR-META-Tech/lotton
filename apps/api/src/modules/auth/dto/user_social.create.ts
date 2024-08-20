import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserBySocialDto {
  @ApiProperty({ required: true, example: 'ya29.a0AcM612xWT8S3BE...' })
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
