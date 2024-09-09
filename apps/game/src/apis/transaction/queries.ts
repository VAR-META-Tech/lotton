import { createInfiniteQuery } from 'react-query-kit';

import { getAllTransactionRequest } from './requests';
import type { IGetAllTransactionData, IGetAllTransactionParams } from './types';

export const useInfinityGetAllTransactionQuery = createInfiniteQuery<IGetAllTransactionData, IGetAllTransactionParams>({
  queryKey: ['infinite:/api/transactions'],
  fetcher: (variables, { pageParam = 1 }) => getAllTransactionRequest({ ...variables, page: pageParam }),
  getNextPageParam: (lastPage) => {
    if (lastPage.meta.currentPage === lastPage.meta.totalPages) return null;
    return lastPage.meta.currentPage + 1;
  },
  initialPageParam: 1,
});
