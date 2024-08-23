'use client';

import { useEffect } from 'react';
import { useInfinityPools } from '@/apis/pools';
import { useIntersection } from '@mantine/hooks';

import { Show, VStack } from '@/components/ui/Utilities';

import { PoolItem } from './PoolItem';
import { SkeletonPool } from './SkeletonPool';

export const PoolList = () => {
  const {
    data: poolData,
    fetchNextPage,
    hasNextPage,
    isFetching: loadingPool,
    isFetchingNextPage,
  } = useInfinityPools({
    variables: {
      status: 'ongoing',
      pageSizes: 10,
      page: 1,
    },
  });
  const poolList = poolData?.pages?.flatMap((z) => z.items) ?? [];

  const { ref: rootLoadMore, entry } = useIntersection({
    threshold: 1,
  });

  useEffect(() => {
    if (!entry?.isIntersecting || isFetchingNextPage || !hasNextPage) return;
    fetchNextPage();
  }, [entry?.isIntersecting, fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <VStack spacing={56} align={'center'}>
      {poolList.map((poolItem) => {
        return <PoolItem key={poolItem.id} poolName={poolItem.name} poolId={poolItem.id} />;
      })}

      <Show when={loadingPool}>
        <SkeletonPool />
        <SkeletonPool />
      </Show>

      <div ref={rootLoadMore} />
    </VStack>
  );
};
