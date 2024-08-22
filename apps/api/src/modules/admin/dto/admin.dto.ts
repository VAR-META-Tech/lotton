import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { AdminStatusEnum, RoleEnum } from '@/shared/enums';

export class CreateAdminDto {
  @ApiProperty({ required: true, example: 'gameonton@var-meta.com' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: true, example: 'Admin' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ required: true, example: RoleEnum.ADMIN })
  @IsEnum(RoleEnum)
  @IsNotEmpty()
  role: RoleEnum.SUPER_ADMIN;
}

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @ApiProperty({
    example: AdminStatusEnum.ACTIVE,
    required: true,
    enum: AdminStatusEnum,
  })
  @IsEnum(AdminStatusEnum)
  @IsNotEmpty()
  status?: AdminStatusEnum;
}

export class QueryAdminDto {
  @ApiProperty({
    description: 'status',
    example: AdminStatusEnum.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(AdminStatusEnum)
  status?: AdminStatusEnum;

  @ApiProperty({
    description: 'search',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;
}
