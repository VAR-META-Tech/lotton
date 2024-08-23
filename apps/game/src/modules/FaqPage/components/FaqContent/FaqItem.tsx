'use client';

import React, { FC, ReactNode, useMemo, useState } from 'react';
import { Icons } from '@/assets/icons';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { FAQ_VALUE } from '../utils/const';

interface Props {
  value: string;
  title: string;
  content: ReactNode | string;
}

const FaqItem: FC<Props> = ({ value, title, content }) => {
  const [currentValue, setValue] = useState('');

  const renderSuffix = useMemo(() => {
    if (currentValue === FAQ_VALUE.TICKET_VALUES_SOURCE) return <Icons.minus className="text-white" />;

    return <Icons.plus className="text-white" />;
  }, [currentValue]);

  return (
    <Accordion value={currentValue} onValueChange={setValue} type="single" collapsible className="w-full text-white">
      <AccordionItem value={value} className="border-gray-color">
        <AccordionTrigger className="py-1.5 text-sm font-normal text-left container" suffix={renderSuffix}>
          {title}
        </AccordionTrigger>

        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FaqItem;
