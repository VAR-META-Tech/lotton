import { request } from '../axios';
import type { IGetPoolDetailParams, IGetPoolDetailResponse, IGetPoolsParams, IGetPoolsResponse } from './types';

export const getAllPoolsRequest = async (params: IGetPoolsParams): Promise<IGetPoolsResponse> => {
  const { data } = await request({
    url: '/api/pools',
    method: 'GET',
    params,
  });

  return data;
};

export const getPoolDetailRequest = async (params: IGetPoolDetailParams): Promise<IGetPoolDetailResponse> => {
  const { data } = await request({
    url: `/api/pools/${params.id}`,
    method: 'GET',
    params,
  });

  return data;
};
