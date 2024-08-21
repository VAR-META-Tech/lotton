import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { BaseTime } from './base/time.entity';
import { Token } from './token.entity';

@Entity()
export class Transaction extends BaseTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false })
  fromAddress: string;

  @Column({ length: 100, nullable: false })
  toAddress: string;

  @Column({ length: 100, nullable: false })
  value: string;

  @Column({ length: 20, nullable: false })
  blockTimestamp: string;

  @Column({ length: 20, nullable: false })
  blockNumber: string;

  @Column({ length: 255, nullable: false })
  transactionHash: string;

  @ManyToOne(() => Token, (token) => token.transactions, {
    onDelete: 'CASCADE',
  })
  token: Token;
}
