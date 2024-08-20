import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { NetworkToken } from '.';
import { BaseTime } from './base/time.entity';

@Entity()
export class Network extends BaseTime {
  @PrimaryColumn()
  chainId: number;

  @Column({ length: 100, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  icon: string;

  @Column({ length: 10, nullable: false })
  symbol: string;

  @Column({ length: 255, nullable: false })
  scanAPI: string;

  @Column({ length: 255, nullable: false })
  rpcEndpoint: string;

  @Column({ length: 255, nullable: false })
  explorerEndpoint: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => NetworkToken, (networkToken) => networkToken.network)
  networkTokens: NetworkToken[];
}
