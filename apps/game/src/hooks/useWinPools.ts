import { usePoolJoinedQuery } from '@/apis/pools';
import { useEffect } from 'react';
import { useAuth } from './useAuth';

export const useWinPools = (limit = 999999999999999, type: 'winner' | 'joined' = 'winner') => {
  const { isLoggedIn, status } = useAuth();
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
    if (!isLoggedIn || status !== 'ready') return;

    const refetchInterval = setInterval(() => {
      refetch();
    }, 10000);

    return () => clearInterval(refetchInterval);
  }, [isLoggedIn, refetch, status]);

  return {
    poolList: poolData?.items ?? [],
    poolData,
    refetch,
    ...rest,
  };
};
