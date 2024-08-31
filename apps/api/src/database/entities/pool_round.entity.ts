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
@Index('pr', ['roundIdOnChain'])
export class PoolRound extends BaseTime {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pool, (pool) => pool.rounds, {
    onDelete: 'CASCADE',
    cascade: true,
    nullable: true,
  })
  pool: Pool;

  @Column({ nullable: true, unique: true })
  roundIdOnChain: number;

  @Column({ unique: true })
  roundNumber: number;

  @Column()
  startTime: number;

  @Column()
  endTime: number;

  @Column({ nullable: true })
  winningCode: string;

  @OneToMany(() => UserTicket, (ticket) => ticket.round)
  ticket: UserTicket;
}
