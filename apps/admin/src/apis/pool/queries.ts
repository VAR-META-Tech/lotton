import { getPoolDetail, getPools } from './requests';
import type { IGetPoolsParams, IGetPoolsListResponse, IGetPoolDetailResponse } from './types';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import type { UseQueryOptions } from '@tanstack/react-query';

export const useGetPools = (
  params: IGetPoolsParams,
  options?: UseQueryOptions<IGetPoolsListResponse, AxiosError, IGetPoolsListResponse, any>
) => {
  return useQuery({
    queryKey: ['/pools', params],
    queryFn: () => getPools(params),
    ...options,
  });
};

export const useGetPoolDetail = (
  id: string,
  options?: UseQueryOptions<IGetPoolDetailResponse, AxiosError, IGetPoolDetailResponse, any>
) => {
  return useQuery({
    queryKey: ['/pool/detail', id],
    queryFn: () => getPoolDetail(id),
    ...options,
  });
};
