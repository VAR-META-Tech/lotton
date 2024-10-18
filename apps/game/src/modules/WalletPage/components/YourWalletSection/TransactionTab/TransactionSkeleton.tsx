import { Skeleton } from '@/components/ui/skeleton';
import { HStack } from '@/components/ui/Utilities';
import React from 'react';

const TransactionSkeleton = () => {
  return (
    <HStack pos={'apart'} align={'center'} className="pt-2 pb-3 text-white border-b border-b-gray-color">
      <HStack spacing={8}>
        <HStack pos={'center'} align={'center'} className="w-8 h-8 bg-navigate-tab rounded-full">
          <Skeleton className="h-6 w-6" />
        </HStack>

        <div className="space-y-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-44" />
        </div>
      </HStack>

      <Skeleton className="h-6 w-28" />
    </HStack>
  );
};

export default TransactionSkeleton;
