import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Admin } from '.';

@Entity()
export class AdminSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Admin, { onDelete: 'CASCADE' })
  @JoinColumn()
  admin: Admin;

  @Column({ type: 'timestamp' })
  expiresAt: Date = new Date(
    Date.now() + Number(process.env.ADMIN_REFRESH_TOKEN_LIFETIME) * 1000,
  );
}
