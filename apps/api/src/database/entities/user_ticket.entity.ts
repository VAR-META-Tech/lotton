import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { BaseTime } from './base/time.entity';
import { PoolRound } from './pool_round.entity';
import { Transaction } from './transaction.entity';
import { User } from './user.entity';

@Entity()
export class UserTicket extends BaseTime {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => PoolRound, (round) => round.id, {
    onDelete: 'CASCADE',
  })
  round: PoolRound;

  @Column()
  code: string;

  @Column({ nullable: true })
  winningCode: string;

  @Column({ nullable: true, zerofill: true })
  winningMatch: number;

  @ManyToOne(() => Transaction, (round) => round.id, {
    onDelete: 'CASCADE',
  })
  transaction: Transaction;
}
