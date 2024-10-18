import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Pool, UserTicket } from '.';
import { BaseTime } from './base/time.entity';

@Entity()
@Index('poolRound', ['pool', 'roundIdOnChain'], { unique: true })
export class PoolRound extends BaseTime {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pool, (pool) => pool.rounds, {
    onDelete: 'CASCADE',
    cascade: true,
    nullable: true,
  })
  pool: Pool;

  @Column({ nullable: true })
  roundIdOnChain: number;

  @Column()
  roundNumber: number;

  @Column({ type: 'bigint' })
  startTime: number;

  @Column({ type: 'bigint' })
  endTime: number;

  @Column({ nullable: true })
  winningCode: string;

  @Column({ nullable: true })
  winningBlock: string;

  @OneToMany(() => UserTicket, (ticket) => ticket.round)
  ticket: UserTicket;
}
