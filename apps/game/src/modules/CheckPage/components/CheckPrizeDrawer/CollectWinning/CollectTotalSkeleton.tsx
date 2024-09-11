import { Skeleton } from '@/components/ui/skeleton';
import { HStack, VStack } from '@/components/ui/Utilities';
import { VStackProps } from '@/components/ui/Utilities/v-stack';
import React, { FC, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<VStackProps> {}

const CollectTotalSkeleton: FC<Props> = ({ className }) => {
  return (
    <VStack className={className}>
      <HStack pos={'apart'} align={'center'}>
        <Skeleton className="bg-background h-6 w-32" />

        <Skeleton className="bg-background h-7 w-32" />
      </HStack>
    </VStack>
  );
};

export default CollectTotalSkeleton;
