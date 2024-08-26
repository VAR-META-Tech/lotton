import { Skeleton } from '@/components/ui/skeleton';
import { HStack } from '@/components/ui/Utilities';
import { cn } from '@/lib/utils';
import React from 'react';

const PaginationSkeleton = () => {
  return (
    <HStack pos={'center'}>
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton
          key={index}
          aria-label="dot"
          className={cn('h-2 w-3 rounded-full', {
            'w-6': index === 0,
          })}
        />
      ))}
    </HStack>
  );
};

export default PaginationSkeleton;
