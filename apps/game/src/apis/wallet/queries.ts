import { createQuery } from 'react-query-kit';

import {
  getAddressBalanceRequest,
  getAddressInformationRequest,
  getExtendedAddressInformationRequest,
} from './requests';
import type {
  IGetAddressBalanceParams,
  IGetAddressBalanceResponse,
  IGetAddressInformationParams,
  IGetAddressInformationResponse,
  IGetExtendedAddressInformationParams,
  IGetExtendedAddressInformationResponse,
} from './types';

export const useGetAddressInformationQuery = createQuery<IGetAddressInformationResponse, IGetAddressInformationParams>({
  queryKey: ['/getAddressInformation'],
  fetcher: getAddressInformationRequest,
});

export const useGetExtendedAddressInformationQuery = createQuery<
  IGetExtendedAddressInformationResponse,
  IGetExtendedAddressInformationParams
>({
  queryKey: ['/getExtendedAddressInformation'],
  fetcher: getExtendedAddressInformationRequest,
});

export const useGetAddressBalanceQuery = createQuery<IGetAddressBalanceResponse, IGetAddressBalanceParams>({
  queryKey: ['/getAddressInformation'],
  fetcher: getAddressBalanceRequest,
});
