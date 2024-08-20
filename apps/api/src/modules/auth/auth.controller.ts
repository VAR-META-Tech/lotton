import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetUser } from '@/common/decorators/user.decorator';
import {
  BasicAuthEnum,
  SocialAuthEnum,
  SwaggerOperationEnum,
} from '@/shared/enums';
import type { TokensType } from '@/shared/types';
import { JwtPayloadType } from '@/shared/types';

import { AuthFactory } from './auth.factory';
import { AuthHelperService } from './auth_helper.service';
import { CreateUserBySocialDto } from './dto/user_social.create';
import { CreateWalletDto } from './dto/wallet.create';
import { AdminJwtRefreshTokenGuard } from './guards/admin_jwt_refresh_token.guard';
import { UserJwtRefreshTokenGuard } from './guards/user_jwt_refresh_token.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authFactory: AuthFactory,
    private readonly authHelperService: AuthHelperService,
  ) {}

  /**
   * Admin Routes
   */
  @ApiOperation({ summary: SwaggerOperationEnum.ADMIN })
  @Post('admin/login-with-google')
  async loginAsAdminWithGoogle(@Body() dto: CreateUserBySocialDto) {
    const authService = this.authFactory.getSocialAuthService(
      SocialAuthEnum.GOOGLE,
    );
    return await authService.createAdminSession(dto);
  }

  @ApiOperation({ summary: SwaggerOperationEnum.ADMIN })
  @ApiBearerAuth()
  @Get('admin/logout')
  @UseGuards(AdminJwtRefreshTokenGuard)
  async logoutAsAdmin(@GetUser('session') session: string): Promise<boolean> {
    return await this.authHelperService.logoutAsAdmin(session);
  }

  @ApiOperation({ summary: SwaggerOperationEnum.ADMIN })
  @ApiBearerAuth()
  @Get('admin/refresh-token')
  @UseGuards(AdminJwtRefreshTokenGuard)
  async refreshTokenAsAdmin(
    @GetUser() admin: JwtPayloadType,
  ): Promise<TokensType> {
    return await this.authHelperService.refreshTokenAsAdmin(admin);
  }

  /**
   * User Routes
   */

  // @Post('user/register')
  // async registerAsUser(@Body() dto: CreateUserByPasswordDto) {
  //   const authService = this.authFactory.getBasicAuthService(
  //     BasicAuthEnum.USER,
  //   );
  //   return await authService.createUser(dto);
  // }

  // @Post('user/login')
  // async loginAsUser(@Body() dto: ValidateUserByPasswordDto) {
  //   const authService = this.authFactory.getBasicAuthService(
  //     BasicAuthEnum.USER,
  //   );
  //   return await authService.validateUser(dto);
  // }

  @Post('user/login-by-wallet')
  async loginByWallet(@Body() dto: CreateWalletDto) {
    const authService = this.authFactory.getBasicAuthService(
      BasicAuthEnum.USER,
    );
    return await authService.loginByWallet(dto);
  }

  @ApiBearerAuth()
  @Get('user/logout')
  @UseGuards(UserJwtRefreshTokenGuard)
  async logoutAsUser(@GetUser('session') session: string): Promise<boolean> {
    return await this.authHelperService.logoutAsUser(session);
  }

  @ApiBearerAuth()
  @Get('user/refresh-token')
  @UseGuards(UserJwtRefreshTokenGuard)
  async refreshTokenAsUser(
    @GetUser() user: JwtPayloadType,
  ): Promise<TokensType> {
    return await this.authHelperService.refreshTokenAsUser(user);
  }
}
