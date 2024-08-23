import { IGetPoolsParams, useGetAllPoolsQuery } from '@/apis/pools';

export const useGetPools = (query?: IGetPoolsParams) => {
  const { data, ...rest } = useGetAllPoolsQuery({ variables: query });

  return {
    data,
    pools: data?.data?.items || [],
    pagination: data?.data?.meta || {},
    ...rest,
  };
};
