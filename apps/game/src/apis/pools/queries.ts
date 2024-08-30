import { createInfiniteQuery, createQuery } from 'react-query-kit';

import { getAllPoolsRequest, getPoolDetailRequest, getPoolJoinedRequest } from './requests';
import type {
  IGetPoolDetailData,
  IGetPoolDetailParams,
  IGetPoolJoinedData,
  IGetPoolJoinedParams,
  IGetPoolsData,
  IGetPoolsParams,
} from './types';

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

export const useInfinityPoolJoinedQuery = createInfiniteQuery<IGetPoolJoinedData, IGetPoolJoinedParams>({
  queryKey: ['infinite:/api/pools/joined'],
  fetcher: (variables, { pageParam = 1 }) => getPoolJoinedRequest({ ...variables, page: pageParam }),
  getNextPageParam: (lastPage) => {
    if (lastPage?.meta?.currentPage === lastPage?.meta?.totalPages) return null;
    return lastPage?.meta?.currentPage + 1;
  },
  initialPageParam: 1,
});

export const usePoolJoinedQuery = createQuery<IGetPoolJoinedData, IGetPoolJoinedParams>({
  queryKey: ['/api/pools/joined'],
  fetcher: getPoolJoinedRequest,
});
