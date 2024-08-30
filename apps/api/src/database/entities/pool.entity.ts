import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Token } from '.';
import { BaseTime } from './base/time.entity';
import { PoolPrize } from './pool_prize.entity';
import { PoolRound } from './pool_round.entity';

@Entity()
export class Pool extends BaseTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  poolIdOnChain: number;

  @Column({ length: 255, nullable: true })
  name: string;

  @ManyToOne(() => Token)
  currency: Token;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  sequency: number;

  @Column()
  totalRounds: number;

  @Column({ type: 'decimal' })
  ticketPrice: number;

  @OneToMany(() => PoolPrize, (poolPrize) => poolPrize.pool)
  poolPrizes: PoolPrize[];

  @OneToMany(() => PoolRound, (round) => round.pool)
  rounds: PoolRound[];
}
