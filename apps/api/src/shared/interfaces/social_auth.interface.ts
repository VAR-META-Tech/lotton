import type { Admin } from '@/database/entities';
import type { CreateUserBySocialDto } from '@/modules/auth/dto/user_social.create';

import type { TokensType } from '../types';

export interface ISocialAuth {
  createAdminSession(
    input: CreateUserBySocialDto,
  ): Promise<{ admin: Admin; tokens: TokensType }>;
}
