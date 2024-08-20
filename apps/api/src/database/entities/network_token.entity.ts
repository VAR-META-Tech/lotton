import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Network, Token } from '.';

@Entity()
export class NetworkToken {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Network, (network) => network.networkTokens, {
    onDelete: 'CASCADE',
  })
  network: Network;

  @ManyToOne(() => Token, (token) => token.networkTokens, {
    onDelete: 'CASCADE',
  })
  token: Token;
}
