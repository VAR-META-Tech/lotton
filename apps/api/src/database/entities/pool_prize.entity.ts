import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Pool } from '.';
import { BaseTime } from './base/time.entity';

@Entity()
@Index('p', ['pool', 'matchNumber'], { unique: true })
export class PoolPrize extends BaseTime {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pool, (pool) => pool.poolPrizes, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  pool: Pool;

  @Column()
  matchNumber: number;

  @Column()
  allocation: number;
}
