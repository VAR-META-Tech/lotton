import React, { forwardRef, HTMLAttributes, memo } from 'react';

import { cn } from '@/lib/utils';
import { VStack } from '@/components/ui/Utilities';

interface Props extends HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string;
  subValue: string;
}

const MatchItem = forwardRef<HTMLDivElement, Props>(({ title, value, subValue, className, ...props }, ref) => {
  return (
    <VStack
      ref={ref}
      {...props}
      className={cn('col-span-1 border border-gray-color rounded-[0.625rem] p-2', className)}
      spacing={0}
    >
      <span className="text-xs text-primary">{title}</span>
      <span className="text-white font-semibold leading-loose">{value}</span>
      <span className="text-xs text-gray-color">{subValue}</span>
    </VStack>
  );
});

export default memo(MatchItem);
