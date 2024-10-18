'use client';

import React, { FC, ReactNode, useMemo, useState } from 'react';
import { Icons } from '@/assets/icons';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface Props {
  value: string;
  title: string;
  content: ReactNode | string;
}

const FaqItem: FC<Props> = ({ value, title, content }) => {
  const [currentValue, setValue] = useState('');

  const renderSuffix = useMemo(() => {
    if (currentValue === value) return <Icons.minus className="text-white min-w-6" />;

    return <Icons.plus className="text-white min-w-6" />;
  }, [currentValue, value]);

  return (
    <Accordion value={currentValue} onValueChange={setValue} type="single" collapsible className="w-full text-white">
      <AccordionItem value={value} className="border-gray-color">
        <AccordionTrigger className="py-1.5 text-sm font-normal text-left mx-2" suffix={renderSuffix}>
          {title}
        </AccordionTrigger>

        <AccordionContent className="mx-2 break-words">{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FaqItem;
