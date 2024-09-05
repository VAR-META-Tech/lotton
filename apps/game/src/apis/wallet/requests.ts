import axios from 'axios';
import {
  IGetBalanceParams,
  IGetBalanceResponse,
  IGetExtendedAddressInformationParams,
  IGetExtendedAddressInformationResponse,
} from './types';
import { TON_API_URL } from '@/lib/const';

export const getBalanceRequest = async (params: IGetBalanceParams): Promise<IGetBalanceResponse> => {
  const { data } = await axios({
    baseURL: `${TON_API_URL}/getAddressInformation`,
    method: 'GET',
    params,
  });

  return data;
};

export const getExtendedAddressInformationRequest = async (
  params: IGetExtendedAddressInformationParams
): Promise<IGetExtendedAddressInformationResponse> => {
  const { data } = await axios({
    baseURL: `${TON_API_URL}/getExtendedAddressInformation`,
    method: 'GET',
    params,
  });

  return data;
};
