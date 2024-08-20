import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Causes } from '@/common/exceptions/causes';
import { User } from '@/database/entities';
import type { IBasicAuth } from '@/shared/interfaces/basic_auth.interface';
import type { TokensType } from '@/shared/types';

import { AuthHelperService } from './auth_helper.service';
import type { ValidateUserByPasswordDto } from './dto/user.validate';
import type { CreateUserByPasswordDto } from './dto/user_basic.create';
import type { CreateWalletDto } from './dto/wallet.create';
import { HashService } from './hash.service';

@Injectable()
export class BasicAuthService implements IBasicAuth {
  constructor(
    private readonly hashService: HashService,
    private readonly authHelperService: AuthHelperService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(
    dto: CreateUserByPasswordDto,
  ): Promise<{ user: User; tokens: TokensType }> {
    const { wallet, password } = dto;

    const userExist = await this.userRepository.findOne({
      where: {
        wallet,
      },
      select: ['id'],
    });

    if (userExist) throw Causes.CONFLICT('User', 'Wallet already exists');

    const passwordHash = await this.hashService.hash(password);

    const user = await this.userRepository.save({
      wallet,
      password: passwordHash,
    });

    const tokens = await this.authHelperService.createTokensAsUser(user);

    delete user.password;

    return {
      user,
      tokens,
    };
  }

  async validateUser(
    dto: ValidateUserByPasswordDto,
  ): Promise<{ user: User; tokens: TokensType }> {
    const { wallet, password } = dto;

    const user = await this.userRepository.findOne({
      where: {
        wallet,
      },
    });

    if (!user) {
      throw Causes.NOT_FOUND('User');
    }

    const isMatch = await this.hashService.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password incorrect');
    }

    const tokens = await this.authHelperService.createTokensAsUser(user);

    delete user.password;

    return {
      user,
      tokens,
    };
  }

  async loginByWallet(
    dto: CreateWalletDto,
  ): Promise<{ user: User; tokens: TokensType }> {
    const { wallet } = dto;

    let user = await this.userRepository.findOne({
      where: {
        wallet,
      },
    });

    if (!user) {
      user = new User();
      user.wallet = wallet;
      user.isActive = true;
      await this.userRepository.save(user);
    }

    const tokens = await this.authHelperService.createTokensAsUser(user);

    return {
      user,
      tokens,
    };
  }
}
