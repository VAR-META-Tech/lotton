import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Pool } from '.';
import { BaseTime } from './base/time.entity';

@Entity()
export class PoolPrize extends BaseTime {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pool, (pool) => pool.poolPrizes, {
    onDelete: 'CASCADE',
  })
  pool: Pool;

  @Column()
  matchNumber: number;

  @Column()
  allocation: number;
}
