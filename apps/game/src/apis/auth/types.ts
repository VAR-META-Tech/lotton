import { TResponse } from '@/types';

export interface ILoginByWalletRequest {
  wallet: string;
}
export interface ILoginByWalletResponse extends TResponse<ILoginByWalletData> {}
export interface ILoginByWalletData {
  user: ILoginByWalletUser;
  tokens: ILoginByWalletTokens;
}

export interface ILoginByWalletUser {
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  id: number;
  wallet: string;
  isActive: boolean;
}

export interface ILoginByWalletTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}
