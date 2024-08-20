import { TResponse } from '@/types';
import axios from 'axios';

import { env } from '@/lib/const';

import { request } from '../axios';
import type { IGetMeResponse, IGoogleSignInRequest, ILoginResponse, ISignInRequest, ISignInResponse } from './types';

export const refreshTokenRequest = async (refreshToken: string): Promise<TResponse<Omit<ILoginResponse, 'user'>>> => {
  const { data } = await axios.get(`${env.API_URL}/api/auth/refresh-token`, {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  return data;
};

export const getUserProfile = async (): Promise<IGetMeResponse> => {
  const { data } = await request({
    url: '/api/user/me',
    method: 'GET',
  });
  return data;
};

export const emailSignInRequest = async (payload: ISignInRequest): Promise<ISignInResponse> => {
  const { data } = await request({
    url: '/api/auth/email/login',
    method: 'POST',
    data: payload,
  });

  return data;
};

export const googleSignInRequest = async (payload: IGoogleSignInRequest): Promise<ISignInResponse> => {
  const { data } = await request({
    url: '/api/auth/login-with-google',
    method: 'POST',
    data: payload,
  });

  return data;
};
