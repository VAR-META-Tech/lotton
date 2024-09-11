import axios from 'axios';
import {
  IGetAddressBalanceParams,
  IGetAddressBalanceResponse,
  IGetAddressInformationParams,
  IGetAddressInformationResponse,
  IGetExtendedAddressInformationParams,
  IGetExtendedAddressInformationResponse,
} from './types';
import { TON_API_URL } from '@/lib/const';

export const getAddressInformationRequest = async (
  params: IGetAddressInformationParams
): Promise<IGetAddressInformationResponse> => {
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

export const getAddressBalanceRequest = async (
  params: IGetAddressBalanceParams
): Promise<IGetAddressBalanceResponse> => {
  const { data } = await axios({
    baseURL: `${TON_API_URL}/getAddressBalance`,
    method: 'GET',
    params,
  });

  return data;
};
