import { createQuery } from 'react-query-kit';

import { getAllPoolsRequest, getPoolDetailRequest } from './requests';
import type { IGetPoolDetailParams, IGetPoolDetailResponse, IGetPoolsParams, IGetPoolsResponse } from './types';

export const useGetAllPoolsQuery = createQuery<IGetPoolsResponse, IGetPoolsParams>({
  queryKey: ['/api/pools'],
  fetcher: getAllPoolsRequest,
});

export const useGetPoolDetailQuery = createQuery<IGetPoolDetailResponse, IGetPoolDetailParams>({
  queryKey: ['/api/pools/:id'],
  fetcher: getPoolDetailRequest,
});
