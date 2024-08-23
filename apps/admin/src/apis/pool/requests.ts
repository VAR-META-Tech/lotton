import { request } from '../axios';
import type { IGetPoolDetailResponse, IGetPoolsListResponse, IGetPoolsParams } from './types';

export const getPools = async (params?: IGetPoolsParams): Promise<IGetPoolsListResponse> => {
  const { data } = await request({
    url: '/api/pools',
    method: 'GET',
    params,
  });

  return data;
};

export const getPoolDetail = async (id: string): Promise<IGetPoolDetailResponse> => {
  const { data } = await request({
    url: `/api/pools/${id}`,
    method: 'GET',
  });

  return data;
};