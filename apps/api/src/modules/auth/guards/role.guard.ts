import type { ExecutionContext } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';

import { ROLES_KEY } from '@/common/decorators/admin_roles.decorator';
import { AdminSession } from '@/database/entities';
import type { RoleEnum } from '@/shared/enums';

import { MyJwtService } from '../jwt.service';

@Injectable()
export class RoleGuard {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: MyJwtService,
    private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      throw new UnauthorizedException('Invalid token');
    }

    const token = authorizationHeader.replace('Bearer ', '');
    const session = await this.jwtService.decodeAccessTokenForAdmin(token);

    if (!session) {
      throw new UnauthorizedException('Invalid token');
    }

    const sessionExist = await this.dataSource
      .createQueryBuilder(AdminSession, 'adminSession')
      .innerJoin('adminSession.admin', 'admin')
      .where('adminSession.id = :id', { id: session })
      .andWhere('adminSession.expiresAt > :date', { date: new Date() })
      .andWhere('admin.isActive = :isActive', { isActive: true })
      .select(['admin.role', 'adminSession.id', 'adminSession.expiresAt'])
      .getOne();

    if (!sessionExist) {
      throw new UnauthorizedException('Token expired');
    }

    return roles.includes(sessionExist.admin.role);
  }
}
