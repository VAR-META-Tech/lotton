import axios from 'axios';
import { IGetBalanceParams, IGetBalanceResponse } from './types';
import { TON_API_URL } from '@/lib/const';

export const getBalanceRequest = async (params: IGetBalanceParams): Promise<IGetBalanceResponse> => {
  const { data } = await axios({
    baseURL: `${TON_API_URL}/getAddressInformation`,
    method: 'GET',
    params,
  });

  return data;
};
