import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Pool, UserTicket } from '.';
import { BaseTime } from './base/time.entity';

@Entity()
export class PoolRound extends BaseTime {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pool, (pool) => pool.poolPrizes, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  pool: Pool;

  @Column({ nullable: true })
  roundIdOnChain: number;

  @Column()
  roundNumber: number;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column({ nullable: true })
  winningHash: string;

  @OneToMany(() => UserTicket, (ticket) => ticket.round)
  ticket: UserTicket;
}
