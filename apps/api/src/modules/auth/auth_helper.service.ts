import { Injectable } from '@nestjs/common';

import type { Admin, User } from '@/database/entities';
import type { JwtPayloadType, TokensType } from '@/shared/types';

import { SessionService } from '../session/session.service';
import { MyJwtService } from './jwt.service';

@Injectable()
export class AuthHelperService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly jwtService: MyJwtService,
  ) {}

  /**
   * Create Token
   */
  async createTokensAsUser(user: User): Promise<TokensType> {
    const { id } = await this.sessionService.createUserSession({
      user,
    });

    const tokens = await this.jwtService.signUserTokens({
      session: id,
    });

    return tokens;
  }

  async createTokensAsAdmin(admin: Admin): Promise<TokensType> {
    const { id } = await this.sessionService.createAdminSession({
      admin,
    });

    const tokens = await this.jwtService.signAdminTokens({
      session: id,
    });

    return tokens;
  }

  /**
   * Refresh Token
   */
  async refreshTokenAsUser(payload: JwtPayloadType): Promise<TokensType> {
    const { session } = payload;
    const { id } = await this.sessionService.createUserSession({
      id: session,
    });

    const tokens = await this.jwtService.signUserTokens({
      session: id,
    });

    return tokens;
  }

  async refreshTokenAsAdmin(payload: JwtPayloadType): Promise<TokensType> {
    const { session } = payload;
    const { id } = await this.sessionService.createAdminSession({
      id: session,
    });

    const tokens = await this.jwtService.signAdminTokens({
      session: id,
    });

    return tokens;
  }

  /**
   * Logout
   */
  async logoutAsUser(session: string): Promise<boolean> {
    return await this.sessionService.deleteUserSession({
      id: session,
    });
  }

  async logoutAsAdmin(session: string): Promise<boolean> {
    return await this.sessionService.deleteAdminSession({
      id: session,
    });
  }
}
