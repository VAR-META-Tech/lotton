import { request } from '../axios';
import type { ILoginByWalletData, ILoginByWalletRequest } from './types';

export const loginByWalletRequest = async (body: ILoginByWalletRequest): Promise<ILoginByWalletData> => {
  const { data } = await request({
    url: '/api/auth/user/login-by-wallet',
    method: 'POST',
    data: body,
  });

  return data;
};
