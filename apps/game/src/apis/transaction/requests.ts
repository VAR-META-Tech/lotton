import { request } from '../axios';
import type { IGetAllTransactionData, IGetAllTransactionParams } from './types';

export const getAllTransactionRequest = async (params: IGetAllTransactionParams): Promise<IGetAllTransactionData> => {
  const { data } = await request({
    url: '/api/transaction',
    method: 'GET',
    params,
  });

  return data;
};
