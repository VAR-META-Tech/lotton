import { Icons } from '@/assets/icons';
import { AccordionTrigger } from '@/components/ui/accordion';
import { HStack } from '@/components/ui/Utilities';
import { cn } from '@/lib/utils';
import React, { FC } from 'react';

interface Props {
  condition: boolean;
  title: string;
}

const AccordionTitle: FC<Props> = ({ condition, title }) => {
  return (
    <AccordionTrigger
      className="text-2xl bg-navigate-tab px-5 py-4 font-normal"
      suffix={
        <HStack spacing={12} className="text-gray-color">
          <span className="text-base">{condition ? 'Hide' : 'Detail'}</span>
          <Icons.chevronDown
            className={cn('h-4 w-4 shrink-0 transition-transform duration-200', {
              'rotate-180': condition,
            })}
          />
        </HStack>
      }
    >
      {title}
    </AccordionTrigger>
  );
};

export default AccordionTitle;
