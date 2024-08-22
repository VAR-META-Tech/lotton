import { request } from '../axios';
import type { ILoginByWalletRequest, ILoginByWalletResponse } from './types';

export const loginByWalletRequest = async (body: ILoginByWalletRequest): Promise<ILoginByWalletResponse> => {
  const { data } = await request({
    url: '/api/auth/user/login-by-wallet',
    method: 'POST',
    data: body,
  });

  return data;
};
