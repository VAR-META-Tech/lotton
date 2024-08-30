import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { BaseTime } from './base/time.entity';

@Entity()
export class Prizes extends BaseTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  poolIdOnChain: number;

  @Column({ type: 'integer' })
  roundIdOnChain: number;

  @Column({ type: 'decimal', nullable: true, zerofill: true })
  totalPrizes: number;

  @Column({ type: 'decimal', nullable: true, zerofill: true })
  claimedPrizes: number;
}
