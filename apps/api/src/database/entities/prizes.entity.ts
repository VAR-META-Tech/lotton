import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { BaseTime } from './base/time.entity';

@Index('prize', ['poolIdOnChain', 'roundIdOnChain'], { unique: true })
@Entity()
export class Prizes extends BaseTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  poolIdOnChain: number;

  @Column({ type: 'integer' })
  roundIdOnChain: number;

  @Column({ type: 'double', nullable: true })
  totalPrizes: number;

  @Column({ type: 'double', nullable: true })
  totalTicketAmount: number;

  @Column({ type: 'double', nullable: true })
  winningPrizes: number;

  @Column({ type: 'double', nullable: true })
  previousPrizes: number;

  @Column({ type: 'double', nullable: true })
  claimedPrizes: number;
}
