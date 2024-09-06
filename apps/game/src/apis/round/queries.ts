import { createQuery } from 'react-query-kit';

import { getTotalTicketsRequest } from './requests';
import type { IGetTotalTicketsParams } from './types';

export const useGetTotalTicketsQuery = createQuery<number, IGetTotalTicketsParams>({
  queryKey: ['/api/rounds/total-tickets'],
  fetcher: getTotalTicketsRequest,
});
