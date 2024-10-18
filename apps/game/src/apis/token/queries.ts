import { createQuery } from 'react-query-kit';

import { getTokenPriceRequest } from './requests';
import type { IGetTokenPriceData, IGetTokenPriceParams } from './types';

export const useGetTokenPriceQuery = createQuery<IGetTokenPriceData, IGetTokenPriceParams>({
  queryKey: ['/api/token-price'],
  fetcher: getTokenPriceRequest,
});
