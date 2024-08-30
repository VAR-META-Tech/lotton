import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseTime } from './base/time.entity';
import { PoolRound } from './pool_round.entity';
import { Transaction } from './transaction.entity';

@Entity()
@Index('user_ticket', ['code', 'userWallet', 'transaction'], { unique: true })
export class UserTicket extends BaseTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userWallet: string;

  @ManyToOne(() => PoolRound, (round) => round.id, {
    onDelete: 'CASCADE',
  })
  round: PoolRound;

  @Column()
  code: string;

  @Column({ nullable: true })
  winningCode: string;

  @Column({ default: false })
  claimed: boolean;

  @Column({ nullable: true, zerofill: true })
  winningMatch: number;

  @ManyToOne(() => Transaction, (round) => round.id, {
    onDelete: 'CASCADE',
  })
  transaction: Transaction;
}
