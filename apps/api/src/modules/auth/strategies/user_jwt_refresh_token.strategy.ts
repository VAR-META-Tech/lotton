import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import type { StellaConfig } from '@/configs';
import type { UserAuthConfig } from '@/configs/user_auth.config';
import { UserSession } from '@/database/entities';
import type { JwtPayloadType } from '@/shared/types';

@Injectable()
export class UserJwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'user-jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService<StellaConfig>,
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        configService.get<UserAuthConfig>('userAuth').refreshTokenSecret,
    });
  }

  async validate(payload: JwtPayloadType): Promise<JwtPayloadType> {
    if (!payload?.session) {
      throw new ForbiddenException();
    }

    const sessionExist = await this.userSessionRepository
      .createQueryBuilder('userSession')
      .where('userSession.id = :id', { id: payload.session })
      .getOne();
    if (!sessionExist) throw new ForbiddenException();

    return payload;
  }
}
