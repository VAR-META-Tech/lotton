import { usePoolJoinedQuery } from '@/apis/pools';

export const useWinPools = (limit = 999999999999999, type: 'winner' | 'joined' = 'winner') => {
  const { data: poolData, ...rest } = usePoolJoinedQuery({
    variables: {
      type: type,
      pageSizes: limit,
      page: 1,
    },
  });

  return {
    poolList: poolData?.items ?? [],
    poolData,
    ...rest,
  };
};
