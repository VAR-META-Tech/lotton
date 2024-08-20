import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AdminSession, UserSession } from '@/database/entities';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
    @InjectRepository(AdminSession)
    private readonly adminSessionRepository: Repository<AdminSession>,
  ) {}

  async createUserSession(options: Partial<UserSession>): Promise<UserSession> {
    const { id, user } = options;
    let userSessionExist: UserSession;

    if (user) {
      userSessionExist = await this.userSessionRepository
        .createQueryBuilder('userSession')
        .where('userSession.user = :user', { user: options.user.id })
        .getOne();
    } else {
      userSessionExist = await this.userSessionRepository
        .createQueryBuilder('userSession')
        .where('userSession.id = :id', { id })
        .innerJoinAndSelect('userSession.user', 'user')
        .getOne();
    }

    if (userSessionExist) {
      await this.deleteUserSession({
        id: userSessionExist.id,
      });
    }

    if (id) {
      options.user = userSessionExist.user;
      delete options.id;
    }

    const userSession = this.userSessionRepository.create(options);
    return await this.userSessionRepository.save(userSession);
  }

  async deleteUserSession(options: Partial<UserSession>): Promise<boolean> {
    const { affected } = await this.userSessionRepository.delete(options);
    return affected > 0;
  }

  async createAdminSession(
    options: Partial<AdminSession>,
  ): Promise<AdminSession> {
    const { id, admin } = options;
    let adminSessionExist: AdminSession;

    if (admin) {
      adminSessionExist = await this.adminSessionRepository
        .createQueryBuilder('adminSession')
        .where('adminSession.admin = :admin', { admin: options.admin.id })
        .getOne();
    } else {
      adminSessionExist = await this.adminSessionRepository
        .createQueryBuilder('adminSession')
        .where('adminSession.id = :id', { id })
        .innerJoinAndSelect('adminSession.admin', 'admin')
        .getOne();
    }

    if (adminSessionExist) {
      await this.deleteAdminSession({
        id: adminSessionExist.id,
      });
    }

    if (id) {
      options.admin = adminSessionExist.admin;
      delete options.id;
    }

    const adminSession = this.adminSessionRepository.create(options);
    return await this.adminSessionRepository.save(adminSession);
  }

  async deleteAdminSession(options: Partial<AdminSession>): Promise<boolean> {
    const { affected } = await this.adminSessionRepository.delete(options);
    return affected > 0;
  }
}
