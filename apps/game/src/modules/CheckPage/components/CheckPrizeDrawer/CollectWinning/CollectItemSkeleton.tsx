import { Skeleton } from '@/components/ui/skeleton';
import { HStack, VStack } from '@/components/ui/Utilities';
import { VStackProps } from '@/components/ui/Utilities/v-stack';
import React, { FC, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<VStackProps> {}

const CollectItemSkeleton: FC<Props> = ({ className }) => {
  return (
    <VStack className={className}>
      <HStack pos={'apart'}>
        <Skeleton className="bg-background h-6 w-16" />

        <Skeleton className="bg-background h-6 w-24" />
      </HStack>

      <HStack pos={'apart'}>
        <Skeleton className="bg-background h-8 w-32" />

        <Skeleton className="bg-background h-5 w-32" />
      </HStack>
    </VStack>
  );
};

export default CollectItemSkeleton;
