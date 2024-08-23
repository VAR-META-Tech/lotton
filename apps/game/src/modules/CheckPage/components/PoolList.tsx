'use client';

import React from 'react';

import { useGetPools } from '@/hooks/useGetPools';
import { VStack } from '@/components/ui/Utilities';

import { PoolItem } from './PoolItem';
import { SkeletonPool } from './SkeletonPool';

export const PoolList = () => {
  const { data: poolListData, isLoading: loadingPool } = useGetPools({
    status: 'ongoing',
  });
  const poolList = poolListData?.data?.items ?? [];

  if (loadingPool)
    return (
      <VStack align={'center'} spacing={32}>
        <SkeletonPool />
        <SkeletonPool />
      </VStack>
    );

  return (
    <VStack spacing={56} align={'center'}>
      {poolList.map((poolItem) => {
        return <PoolItem key={poolItem.id} poolName={poolItem.name} poolId={poolItem.id} />;
      })}
    </VStack>
  );
};
