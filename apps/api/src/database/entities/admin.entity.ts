import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { RoleEnum, SocialAuthEnum } from '@/shared/enums';

import { BaseTime } from './base/time.entity';

@Entity()
export class Admin extends BaseTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100, nullable: false })
  email: string;

  @Column({ length: 100, nullable: false })
  fullName: string;

  @Column({ length: 255, nullable: true })
  socialId: string;

  @Column({
    type: 'enum',
    enum: SocialAuthEnum,
    default: SocialAuthEnum.GOOGLE,
    nullable: false,
  })
  socialType: SocialAuthEnum;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.ADMIN,
    nullable: false,
  })
  role: RoleEnum;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
