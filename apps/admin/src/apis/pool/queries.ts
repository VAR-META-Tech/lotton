import { getPools } from './requests';
import type { IGetPoolsParams, IGetMeResponse } from './types';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import type { UseQueryOptions } from '@tanstack/react-query';

export const useGetPools = (
  params: IGetPoolsParams,
  options?: UseQueryOptions<IGetMeResponse, AxiosError, IGetMeResponse, any>
) => {
  return useQuery({
    queryKey: ['/pools', params],
    queryFn: () => getPools(params),
    ...options,
  });
};
