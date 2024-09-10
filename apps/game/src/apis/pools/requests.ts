import { request } from '../axios';
import type {
  IConfirmClaimParams,
  IGetClaimSignatureData,
  IGetClaimSignatureParams,
  IGetPoolCollectPrizeData,
  IGetPoolCollectPrizeParams,
  IGetPoolDetailData,
  IGetPoolDetailParams,
  IGetPoolJoinedData,
  IGetPoolJoinedParams,
  IGetPoolsData,
  IGetPoolsParams,
} from './types';

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

export const getPoolJoinedRequest = async (params: IGetPoolJoinedParams): Promise<IGetPoolJoinedData> => {
  const { data } = await request({
    url: `/api/pools/joined`,
    method: 'GET',
    params,
  });

  return data;
};

export const getPoolCollectPrizeRequest = async (
  params: IGetPoolCollectPrizeParams
): Promise<IGetPoolCollectPrizeData> => {
  const { data } = await request({
    url: '/api/pools/collect-prize',
    method: 'GET',
    params,
  });

  return data;
};

export const getClaimSignatureRequest = async (params: IGetClaimSignatureParams): Promise<IGetClaimSignatureData> => {
  const { data } = await request({
    url: '/api/pools/claim/signature',
    method: 'GET',
    params,
  });

  return data;
};

export const confirmClaimRequest = async (params: IConfirmClaimParams): Promise<any> => {
  const { data } = await request({
    url: '/api/pools/claim/confirm',
    method: 'GET',
    params,
  });

  return data;
};
