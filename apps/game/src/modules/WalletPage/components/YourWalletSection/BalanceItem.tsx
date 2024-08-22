import React, { FC, HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';
import { HStack } from '@/components/ui/Utilities';

interface Props extends HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string;
}

const BalanceItem: FC<Props> = ({ title, value, className, ...props }) => {
  return (
    <HStack
      pos={'apart'}
      {...props}
      className={cn('text-base font-medium py-1 border-b border-b-gray-color', className)}
    >
      <span>{title}</span>

      <span>{value}</span>
    </HStack>
  );
};

export default BalanceItem;
