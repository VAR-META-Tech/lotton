import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';

export class ContractConfig {
  @IsNotEmpty()
  @IsString()
  gameContractAddress: string;

  @IsNotEmpty()
  @IsString()
  adminWalletPhrase: string;

  @IsNotEmpty()
  @IsString()
  rpcEndpoint: string;

  @IsNotEmpty()
  @IsString()
  apiKey: string;

  constructor() {
    this.gameContractAddress = process.env.GAME_CONTRACT_ADDRESS;
    this.adminWalletPhrase = process.env.ADMIN_WALLET_PHRASE;
    this.rpcEndpoint = process.env.RPC_ENDPOINT;
    this.apiKey = process.env.API_KEY;
  }
}

export default registerAs<ContractConfig>(
  'contract',
  () => new ContractConfig(),
);
