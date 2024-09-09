import { getPoolDetail, getPools, getRoundDetail, getRounds, getTokens } from './requests';
import type { IGetPoolsParams, IGetPoolsListResponse, IGetPoolDetailResponse, IGetRoundsParams, IGetRoundsListResponse, IGetTokenListResponse, IGetRoundDetailResponse } from './types';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import type { UseQueryOptions } from '@tanstack/react-query';

export const useGetTokens = (
  params: any,
  options?: UseQueryOptions<IGetTokenListResponse, AxiosError, IGetTokenListResponse, any>
) => {
  return useQuery({
    queryKey: ['/tokens', params],
    queryFn: () => getTokens(params),
    ...options,
  });
};

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

export const useGetRounds = (
  params: IGetRoundsParams,
  options?: UseQueryOptions<IGetRoundsListResponse, AxiosError, IGetRoundsListResponse, any>
) => {
  return useQuery({
    queryKey: ['/rounds', params],
    queryFn: () => getRounds(params),
    ...options,
  });
};

export const useGetRoundDetail = (
  id: string,
  options?: UseQueryOptions<IGetRoundDetailResponse, AxiosError, IGetRoundDetailResponse, any>
) => {
  return useQuery({
    queryKey: ['/round/detail', id],
    queryFn: () => getRoundDetail(id),
    ...options,
  });
};