import { useGetAllPoolsQuery } from '@/apis/pools';

export const useGetPools = () => {
  const { data, ...rest } = useGetAllPoolsQuery();

  return {
    data,
    pools: data?.data?.items || [],
    pagination: data?.data?.meta || {},
    ...rest,
  };
};
