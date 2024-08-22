import { request } from '../axios';
import type { IGetMeResponse, IGetPoolsParams } from './types';

export const getPools = async (params?: IGetPoolsParams): Promise<IGetMeResponse> => {
  const { data } = await request({
    url: '/api/pools',
    method: 'GET',
    params,
  });

  return data;
};