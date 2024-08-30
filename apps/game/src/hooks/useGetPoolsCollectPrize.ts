import { useGetPoolsCollectPrizeQuery } from '@/apis/pools';

export const useGetPoolsCollectPrize = (limit = 999999999999999, poolId: number, roundId: number) => {
  const { data, ...rest } = useGetPoolsCollectPrizeQuery({
    variables: {
      poolId: poolId,
      roundId: roundId,
      pageSizes: limit,
      page: 1,
    },
    enabled: !!poolId && !!roundId,
  });

  return {
    items: data?.items ?? [],
    data,
    ...rest,
  };
};
