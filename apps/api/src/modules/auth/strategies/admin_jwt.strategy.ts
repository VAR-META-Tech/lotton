import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { Causes } from '@/common/exceptions/causes';
import type { StellaConfig } from '@/configs';
import type { AdminAuthConfig } from '@/configs/admin_auth.config';
import { AdminSession } from '@/database/entities';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(
    private readonly configService: ConfigService<StellaConfig>,
    @InjectRepository(AdminSession)
    private readonly adminSessionRepository: Repository<AdminSession>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        configService.get<AdminAuthConfig>('adminAuth').accessTokenSecret,
    });
  }

  async validate(payload: { session: string }) {
    const adminSession = await this.adminSessionRepository
      .createQueryBuilder('adminSession')
      .innerJoin('adminSession.admin', 'admin')
      .where('adminSession.id = :id', { id: payload.session })
      .andWhere('adminSession.expiresAt > :date', { date: new Date() })
      .andWhere('admin.isActive = :isActive', { isActive: true })
      .select([
        'admin.id',
        'admin.email',
        'admin.fullName',
        'admin.socialId',
        'admin.socialType',
        'admin.role',
        'admin.isActive',
        'admin.createdAt',
        'adminSession.id',
        'adminSession.expiresAt',
      ])
      .getOne();

    if (!adminSession)
      throw Causes.UNAUTHORIZED('Access Token', 'Invalid access token');

    adminSession.expiresAt = undefined;
    adminSession.id = undefined;

    return adminSession;
  }
}
