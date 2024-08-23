import { request } from '../axios';
import type { IGetPoolDetailData, IGetPoolDetailParams, IGetPoolsData, IGetPoolsParams } from './types';

export const getAllPoolsRequest = async (params: IGetPoolsParams): Promise<IGetPoolsData> => {
  const { data } = await request({
    url: '/api/pools',
    method: 'GET',
    params,
  });

  return data;
};

export const getPoolDetailRequest = async (params: IGetPoolDetailParams): Promise<IGetPoolDetailData> => {
  const { data } = await request({
    url: `/api/pools/${params.id}`,
    method: 'GET',
    params,
  });

  return data;
};
