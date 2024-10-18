'use client';

import { memo, useEffect } from 'react';
import { useIntersection } from '@mantine/hooks';

import { Show, VStack } from '@/components/ui/Utilities';

import { PoolItem } from './PoolItem';
import { SkeletonPool } from './SkeletonPool';
import { useInfinityPoolJoined } from '@/hooks/useInfinityPoolJoined';

const PoolList = () => {
  const { poolList = [], fetchNextPage, hasNextPage, loadingPool, isFetchingNextPage } = useInfinityPoolJoined();

  const { ref: rootLoadMore, entry } = useIntersection({
    threshold: 1,
  });

  useEffect(() => {
    if (!entry?.isIntersecting || isFetchingNextPage || !hasNextPage) return;
    fetchNextPage();
  }, [entry?.isIntersecting, fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <VStack spacing={24}>
      <h1 className="text-white text-center w-full text-2xl">Play history</h1>

      <VStack spacing={56} align={'center'}>
        <Show when={poolList?.length > 0}>
          {poolList?.map((pool, index) => {
            return <PoolItem key={`${pool?.id}-${index}`} pool={pool} />;
          })}
        </Show>

        <Show when={loadingPool}>
          <VStack className="w-full">
            <SkeletonPool />
            <SkeletonPool />
          </VStack>
        </Show>

        {!!poolList?.length && <div ref={rootLoadMore} />}
      </VStack>
    </VStack>
  );
};

export default memo(PoolList);
