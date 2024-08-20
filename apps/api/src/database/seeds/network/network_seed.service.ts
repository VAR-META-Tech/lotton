import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { getLogger } from '@/utils/logger';

import { Network } from '../../entities';

@Injectable()
export class NetworkSeedService {
  logger = getLogger(NetworkSeedService.name);

  constructor(
    @InjectRepository(Network)
    private readonly networkRepository: Repository<Network>,
  ) {}

  async bootstrap(): Promise<void> {
    await this.truncateTables();
    await this.seedNetwork();

    this.logger.info(
      'The data seeding process for Network has been completed successfully!',
    );
  }

  private async truncateTables(): Promise<void> {
    await this.networkRepository.query(
      `DELETE FROM network WHERE chainId > 0;`,
    );
    await this.networkRepository.query(
      `ALTER TABLE network AUTO_INCREMENT = 1;`,
    );
  }

  private async seedNetwork(): Promise<void> {
    const networks = [
      {
        chainId: 1,
        name: 'Ethereum',
        icon: null,
        symbol: 'ETH',
        scanAPI: 'https://api.etherscan.io/api',
        rpcEndpoint: 'wss://ethereum-rpc.publicnode.com',
        explorerEndpoint: 'https://etherscan.io',
        isActive: true,
      },
      {
        chainId: 56,
        name: 'Binance Smart Chain',
        icon: null,
        symbol: 'BSC',
        scanAPI: 'https://api.bscscan.com/api',
        rpcEndpoint: 'wss://bsc-rpc.publicnode.com',
        explorerEndpoint: 'https://bscscan.com',
        isActive: true,
      },
      {
        chainId: 137,
        name: 'Polygon',
        icon: null,
        symbol: 'MATIC',
        scanAPI: 'https://api.polygonscan.com/api',
        rpcEndpoint: 'wss://polygon-bor-rpc.publicnode.com',
        explorerEndpoint: 'https://polygonscan.com',
        isActive: true,
      },
    ];

    const values = networks
      .map(
        (network) =>
          `(${network.chainId}, '${network.name}', '${network.symbol}', '${network.scanAPI}', '${network.rpcEndpoint}', '${network.explorerEndpoint}', ${network.isActive})`,
      )
      .join(', ');

    await this.networkRepository.query(
      `INSERT INTO network (chainId, name, symbol, scanAPI, rpcEndpoint, explorerEndpoint, isActive) VALUES ${values};`,
    );
  }
}
