import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserTicketStatus } from '@/shared/enums';

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

  @Column({
    type: 'enum',
    enum: UserTicketStatus,
    default: UserTicketStatus.BOUGHT,
  })
  status: UserTicketStatus;

  @Column({ type: 'timestamp' })
  claimedAt: Date;

  @Column({ nullable: true })
  winningMatch: number;

  @ManyToOne(() => Transaction, (round) => round.id, {
    onDelete: 'CASCADE',
  })
  transaction: Transaction;
}
