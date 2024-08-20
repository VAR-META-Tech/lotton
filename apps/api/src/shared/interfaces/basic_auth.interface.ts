import type { User } from '@/database/entities';
import type { ValidateUserByPasswordDto } from '@/modules/auth/dto/user.validate';
import type { CreateUserByPasswordDto } from '@/modules/auth/dto/user_basic.create';
import type { CreateWalletDto } from '@/modules/auth/dto/wallet.create';

import type { TokensType } from '../types';

export interface IBasicAuth {
  createUser(
    input: CreateUserByPasswordDto,
  ): Promise<{ user: User; tokens: TokensType }>;

  validateUser(
    input: ValidateUserByPasswordDto,
  ): Promise<{ user: User; tokens: TokensType }>;

  loginByWallet(
    input: CreateWalletDto,
  ): Promise<{ user: User; tokens: TokensType }>;
}
