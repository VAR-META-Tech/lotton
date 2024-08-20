import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

import { BaseTime } from './base/time.entity';

@Entity()
@Index(['blockNumber'], { unique: false })
export class LatestBlock extends BaseTime {
  @PrimaryColumn({ length: 255 })
  key: string;

  @Column({ type: 'bigint', nullable: false })
  blockNumber: number;
}
