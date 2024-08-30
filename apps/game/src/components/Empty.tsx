import { GalleryVerticalEnd } from 'lucide-react';
import React, { forwardRef } from 'react';
import { VStack } from './ui/Utilities';
import { VStackProps } from './ui/Utilities/v-stack';
import { cn } from '@/lib/utils';

interface Props extends VStackProps {
  emptyText?: string;
}

const Empty = forwardRef<HTMLDivElement, Props>(({ emptyText, className, ...props }, ref) => {
  return (
    <VStack
      justify={'center'}
      align={'center'}
      spacing={16}
      ref={ref}
      {...props}
      className={cn('min-h-32 select-none text-gray-color', className)}
    >
      <GalleryVerticalEnd size={50} />

      <p>{emptyText ?? 'No data'}</p>
    </VStack>
  );
});

export default Empty;
