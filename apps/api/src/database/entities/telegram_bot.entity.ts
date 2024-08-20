import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseTime } from './base/time.entity';

@Entity()
export class TelegramBot extends BaseTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  name: string;

  @Column({ length: 255, nullable: false })
  token: string;
}
