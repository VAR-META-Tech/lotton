import { createInfiniteQuery, createQuery } from 'react-query-kit';

import { getBalanceRequest } from './requests';
import type { IGetBalanceParams, IGetBalanceResponse } from './types';

export const useGetBalanceQuery = createQuery<IGetBalanceResponse, IGetBalanceParams>({
  queryKey: ['/getAddressInformation'],
  fetcher: getBalanceRequest,
});
