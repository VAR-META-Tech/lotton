import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseTime } from './base/time.entity';

@Entity()
export class User extends BaseTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100, nullable: true })
  username: string;

  @Column({ unique: true, length: 100, nullable: true })
  wallet: string;

  @Column({ length: 100, nullable: true })
  fullName: string;

  @Column({ type: 'text', nullable: true })
  password: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
