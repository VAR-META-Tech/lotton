import { HStack } from '@/components/ui/Utilities';
import { cn } from '@/lib/utils';
import React, { FC, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  name: string;
  roundActiveNumber: number;
  nameClassName?: Props['className'];
  valueClassName?: Props['className'];
}

const TicketInfo: FC<Props> = ({ name, roundActiveNumber, nameClassName, valueClassName, className, ...props }) => {
  return (
    <HStack pos={'apart'} {...props} className={cn('border border-primary', className)}>
      <p className={cn('font-semibold text-2xl bg-primary text-white py-1 px-2', nameClassName)}>{name}</p>

      <p className={cn('text-right px-2 text-lg', valueClassName)}>Round {roundActiveNumber}</p>
    </HStack>
  );
};

export default TicketInfo;
