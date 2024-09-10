import { Skeleton } from '@/components/ui/skeleton';
import { HStack, VStack } from '@/components/ui/Utilities';
import React from 'react';

const CollectItemSkeleton = () => {
  return (
    <VStack>
      <HStack pos={'apart'}>
        <Skeleton className="h-6 w-16" />

        <Skeleton className="h-6 w-24" />
      </HStack>

      <HStack pos={'apart'}>
        <Skeleton className="h-8 w-32" />

        <Skeleton className="h-5 w-32" />
      </HStack>
    </VStack>
  );
};

export default CollectItemSkeleton;
