import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminSession, UserSession } from '@/database/entities';

import { SessionService } from './session.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserSession, AdminSession])],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
