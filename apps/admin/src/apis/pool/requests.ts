import { request } from '../axios';
import type { IGetPoolDetailResponse, IGetPoolsListResponse, IGetPoolsParams, IGetRoundsListResponse, IGetRoundsParams } from './types';

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

export const getRounds = async (params?: IGetRoundsParams): Promise<IGetRoundsListResponse> => {
  const { data } = await request({
    url: '/api/rounds',
    method: 'GET',
    params,
  });

  return data;
};