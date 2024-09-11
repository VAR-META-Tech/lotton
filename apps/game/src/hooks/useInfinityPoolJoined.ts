import { useInfinityPoolJoinedQuery } from '@/apis/pools';
import { useEffect } from 'react';
import { useAuth } from './useAuth';

export const useInfinityPoolJoined = () => {
  const { isLoggedIn, status } = useAuth();
  const {
    data: poolData,
    fetchNextPage,
    hasNextPage,
    isFetching: loadingPool,
    isFetchingNextPage,
    refetch,
    ...rest
  } = useInfinityPoolJoinedQuery({
    variables: {
      type: 'joined',
      pageSizes: 5,
      page: 1,
    },
    enabled: isLoggedIn,
  });

  const poolList = poolData?.pages?.flatMap((z) => z?.items) ?? [];

  useEffect(() => {
    if (!isLoggedIn || status !== 'ready') return;

    const refetchInterval = setInterval(() => {
      refetch();
    }, 10000);

    return () => clearInterval(refetchInterval);
  }, [isLoggedIn, refetch, status]);

  return {
    poolList,
    fetchNextPage,
    hasNextPage,
    loadingPool,
    isFetchingNextPage,
    poolData,
    refetch,
    ...rest,
  };
};
