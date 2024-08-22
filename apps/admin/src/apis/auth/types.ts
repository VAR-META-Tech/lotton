import { type IMeta, type TResponse } from '@/types';

export interface ILoginResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export interface IToken {
  accessToken: string;
  refreshToken: string;
  tokenExpired: number;
}

export interface IUser {
  id: number;
  username: string | null;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
  wallets: string[];
}

export interface ISignInResponseData {
  user: IUser;
  tokens: IToken;
  accessToken: string;
}

export interface ISignInRequest {
  email: string;
  password: string;
}

export interface IGoogleSignInRequest {
  accessToken: string;
}

export interface ISignInResponse extends TResponse<ISignInResponseData> {}

export interface IGetMeResponse extends TResponse<IUser> {}
