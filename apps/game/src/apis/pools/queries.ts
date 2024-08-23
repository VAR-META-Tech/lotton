import { createInfiniteQuery, createQuery } from 'react-query-kit';

import { getAllPoolsRequest, getPoolDetailRequest } from './requests';
import type { IGetPoolDetailData, IGetPoolDetailParams, IGetPoolsData, IGetPoolsParams } from './types';

export const useGetAllPoolsQuery = createQuery<IGetPoolsData, IGetPoolsParams>({
  queryKey: ['/api/pools'],
  fetcher: getAllPoolsRequest,
});

export const useGetPoolDetailQuery = createQuery<IGetPoolDetailData, IGetPoolDetailParams>({
  queryKey: ['/api/pools/:id'],
  fetcher: getPoolDetailRequest,
});

export const useInfinityPools = createInfiniteQuery<IGetPoolsData, IGetPoolsParams>({
  queryKey: ['infinite:/api/pools'],
  fetcher: (variables, { pageParam = 1 }) => getAllPoolsRequest({ ...variables, page: pageParam }),
  getNextPageParam: (lastPage) => {
    if (lastPage.meta.currentPage === lastPage.meta.totalPages) return null;
    return lastPage.meta.currentPage + 1;
  },
  initialPageParam: 1,
});
