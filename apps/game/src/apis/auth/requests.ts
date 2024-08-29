import axios from 'axios';
import { request } from '../axios';
import type { ILoginByWalletData, ILoginByWalletRequest, IRefreshTokenResponse } from './types';
import { env } from '@/lib/const';

export const loginByWalletRequest = async (body: ILoginByWalletRequest): Promise<ILoginByWalletData> => {
  const { data } = await request({
    url: '/api/auth/user/login-by-wallet',
    method: 'POST',
    data: body,
  });

  return data;
};

export const refreshTokenRequest = async (refreshToken: string): Promise<IRefreshTokenResponse> => {
  const { data } = await axios({
    baseURL: `${env.API_URL}/api/auth/user/refresh-token`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  return data;
};
