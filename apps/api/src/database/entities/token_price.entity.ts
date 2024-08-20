import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Token } from '.';
import { BaseTime } from './base/time.entity';

@Entity()
export class TokenPrice extends BaseTime {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Token)
  token: Token;

  @Column({ length: 100, nullable: false })
  price: string;
}
