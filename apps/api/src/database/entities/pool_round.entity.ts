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

  @ManyToOne(() => Pool, (pool) => pool.rounds, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  poolIdOnChain: number;

  @Column({ nullable: true })
  roundIdOnChain: number;

  @Column()
  roundNumber: number;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column({ nullable: true })
  winningCode: string;

  @OneToMany(() => UserTicket, (ticket) => ticket.round)
  ticket: UserTicket;
}
