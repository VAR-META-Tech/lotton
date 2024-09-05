import { useInfinityPoolJoinedQuery } from '@/apis/pools';

export const useInfinityPoolJoined = () => {
  const {
    data: poolData,
    fetchNextPage,
    hasNextPage,
    isFetching: loadingPool,
    isFetchingNextPage,
    ...rest
  } = useInfinityPoolJoinedQuery({
    variables: {
      type: 'joined',
      pageSizes: 100,
      page: 1,
    },
  });

  const poolList = poolData?.pages?.flatMap((z) => z?.items) ?? [];

  return {
    poolList,
    fetchNextPage,
    hasNextPage,
    loadingPool,
    isFetchingNextPage,
    poolData,
    ...rest,
  };
};
