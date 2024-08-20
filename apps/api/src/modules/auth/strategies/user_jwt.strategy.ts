import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { Causes } from '@/common/exceptions/causes';
import type { StellaConfig } from '@/configs';
import type { UserAuthConfig } from '@/configs/user_auth.config';
import { UserSession } from '@/database/entities';
import { RedisService } from '@/modules/services/redis.service';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'user-jwt') {
  constructor(
    private readonly configService: ConfigService<StellaConfig>,
    private readonly redisService: RedisService,
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        configService.get<UserAuthConfig>('userAuth').accessTokenSecret,
    });
  }

  async validate(payload: { session: string }) {
    const key = `user:${payload.session}`;

    let userExist = await this.redisService.get(key);
    if (!userExist) {
      userExist = await this.userSessionRepository
        .createQueryBuilder('userSession')
        .innerJoin('userSession.user', 'user')
        .where('userSession.id = :id', { id: payload.session })
        .andWhere('userSession.expiresAt > :date', { date: new Date() })
        .andWhere('user.isActive = :isActive', { isActive: true })
        .select([
          'user.id',
          'user.email',
          'user.fullName',
          'user.isActive',
          'user.createdAt',
          'userSession.id',
          'userSession.expiresAt',
        ])
        .getOne();

      if (!userExist)
        throw Causes.UNAUTHORIZED('Access Token', 'Invalid access token');

      userExist.expiresAt = undefined;
      userExist.id = undefined;

      await this.redisService.set(key, userExist, 1800); // expires in 30 minutes
    }

    return userExist;
  }
}
