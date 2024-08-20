import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'aws-sdk/clients/appstream';

import { GetUser } from '@/common/decorators/user.decorator';

import { UserJwtGuard } from '../auth/guards/user_jwt.guard';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  @Get('me')
  @UseGuards(UserJwtGuard)
  async getMe(@GetUser() user: User): Promise<User> {
    return user;
  }
}
