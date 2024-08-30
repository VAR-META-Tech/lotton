'use client';

import { useEffect } from 'react';
import { useIntersection } from '@mantine/hooks';

import { Show, VStack } from '@/components/ui/Utilities';

import { PoolItem } from './PoolItem';
import { SkeletonPool } from './SkeletonPool';
import { useInfinityPoolJoined } from '@/hooks/useInfinityPoolJoined';

export const PoolList = () => {
  const { poolList, fetchNextPage, hasNextPage, loadingPool, isFetchingNextPage } = useInfinityPoolJoined();

  const { ref: rootLoadMore, entry } = useIntersection({
    threshold: 1,
  });

  useEffect(() => {
    if (!entry?.isIntersecting || isFetchingNextPage || !hasNextPage) return;
    fetchNextPage();
  }, [entry?.isIntersecting, fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <VStack spacing={56} align={'center'}>
      {!!poolList?.length && (
        <VStack className="min-h-[calc(100vh-6.25rem)]">
          {poolList?.map((poolItem, index) => {
            return <PoolItem key={`${poolItem?.id}-${index}`} pool={poolItem} />;
          })}
        </VStack>
      )}

      <Show when={loadingPool}>
        <SkeletonPool />
        <SkeletonPool />
      </Show>

      <div ref={rootLoadMore} />
    </VStack>
  );
};
