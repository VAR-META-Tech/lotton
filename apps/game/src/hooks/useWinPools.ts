import { usePoolJoinedQuery } from '@/apis/pools';
import { useEffect } from 'react';

export const useWinPools = (limit = 999999999999999, type: 'winner' | 'joined' = 'winner') => {
  const {
    data: poolData,
    refetch,
    ...rest
  } = usePoolJoinedQuery({
    variables: {
      type: type,
      pageSizes: limit,
      page: 1,
    },
  });

  useEffect(() => {
    const refetchInterval = setInterval(() => {
      refetch();
    }, 10000);

    return () => clearInterval(refetchInterval);
  }, [refetch]);

  return {
    poolList: poolData?.items ?? [],
    poolData,
    refetch,
    ...rest,
  };
};
