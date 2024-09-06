import { request } from '../axios';
import type { IGetTokenPriceData, IGetTokenPriceParams } from './types';

export const getTokenPriceRequest = async (params: IGetTokenPriceParams): Promise<IGetTokenPriceData> => {
  const { data } = await request({
    url: '/api/token-price',
    method: 'GET',
    params,
  });

  return data;
};
