import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';

export class ContractConfig {
  @IsNotEmpty()
  @IsString()
  gameContractAddress: string;

  constructor() {
    this.gameContractAddress = process.env.GAME_CONTRACT_ADDRESS;
  }
}

export default registerAs<ContractConfig>(
  'contract',
  () => new ContractConfig(),
);
