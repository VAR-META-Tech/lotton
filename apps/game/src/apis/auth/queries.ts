import { createQuery } from 'react-query-kit';

import { getUserProfile } from './requests';
import type { IGetMeResponse } from './types';

export const useUserQuery = createQuery<IGetMeResponse>({
  queryKey: ['/profile'],
  fetcher: getUserProfile,
});
