import { Skeleton } from '@/components/ui/skeleton';
import { HStack, VStack } from '@/components/ui/Utilities';
import { VStackProps } from '@/components/ui/Utilities/v-stack';
import { cn } from '@/lib/utils';
import React, { FC, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<VStackProps> {
  titleClassName?: Props['className'];
  valueClassName?: Props['className'];
}

const CollectTotalSkeleton: FC<Props> = ({ className, titleClassName, valueClassName }) => {
  return (
    <VStack className={className}>
      <HStack pos={'apart'} align={'center'}>
        <Skeleton className={cn('bg-background h-6 w-32', titleClassName)} />

        <Skeleton className={cn('bg-background h-7 w-32', valueClassName)} />
      </HStack>
    </VStack>
  );
};

export default CollectTotalSkeleton;
