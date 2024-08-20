import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import type { StellaConfig } from '@/configs';
import type { AdminAuthConfig } from '@/configs/admin_auth.config';
import { AdminSession } from '@/database/entities';
import type { JwtPayloadType } from '@/shared/types';

@Injectable()
export class AdminJwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'admin-jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService<StellaConfig>,
    @InjectRepository(AdminSession)
    private readonly adminSessionRepository: Repository<AdminSession>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        configService.get<AdminAuthConfig>('adminAuth').refreshTokenSecret,
    });
  }

  async validate(payload: JwtPayloadType): Promise<JwtPayloadType> {
    if (!payload?.session) {
      throw new ForbiddenException();
    }

    const sessionExist = await this.adminSessionRepository
      .createQueryBuilder('adminSession')
      .where('adminSession.id = :id', { id: payload.session })
      .getOne();
    if (!sessionExist) throw new ForbiddenException();

    return payload;
  }
}
