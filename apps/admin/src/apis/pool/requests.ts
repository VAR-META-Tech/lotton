import { request } from '../axios';
import type { IGetPoolDetailResponse, IGetPoolsListResponse, IGetPoolsParams, IGetRoundDetailResponse, IGetRoundsListResponse, IGetRoundsParams, IGetTokenListResponse, IPayloadCreatePool, IPoolItem, IResCreatePool } from './types';

export const getTokens = async (params?: any): Promise<IGetTokenListResponse> => {
  const { data } = await request({
    url: '/api/token',
    method: 'GET',
    params,
  });

  return data;
};

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

export const createPool = async (payload: IPayloadCreatePool): Promise<IResCreatePool> => {
  const { data } = await request({
    url: '/api/pools',
    method: 'POST',
    data: payload,
  });

  return data;
};

export const deletePool = async (poolId: number): Promise<IPoolItem> => {
  const { data } = await request({
    url: `/api/pools/${poolId}`,
    method: 'DELETE',
  });

  return data;
};

export const updatePool = async ({
  poolId,
  payload,
}: {
  poolId: number;
  payload:IPayloadCreatePool;
}): Promise<IResCreatePool> => {
  const { data } = await request({
    url: `/api/pools/${poolId}`,
    method: 'PUT',
    data: payload,
  });

  return data;
};

export const getRoundDetail = async (id: string): Promise<IGetRoundDetailResponse> => {
  const { data } = await request({
    url: `/api/rounds/${id}`,
    method: 'GET',
  });

  return data;
};