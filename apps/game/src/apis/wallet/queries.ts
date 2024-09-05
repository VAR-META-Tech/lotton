import { createQuery } from 'react-query-kit';

import { getBalanceRequest, getExtendedAddressInformationRequest } from './requests';
import type {
  IGetBalanceParams,
  IGetBalanceResponse,
  IGetExtendedAddressInformationParams,
  IGetExtendedAddressInformationResponse,
} from './types';

export const useGetBalanceQuery = createQuery<IGetBalanceResponse, IGetBalanceParams>({
  queryKey: ['/getAddressInformation'],
  fetcher: getBalanceRequest,
});

export const useGetExtendedAddressInformationQuery = createQuery<
  IGetExtendedAddressInformationResponse,
  IGetExtendedAddressInformationParams
>({
  queryKey: ['/getExtendedAddressInformation'],
  fetcher: getExtendedAddressInformationRequest,
});
