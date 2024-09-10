'use client';

import React from 'react';

import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion';
import { VStack } from '@/components/ui/Utilities';

import { ACCORDION_VALUE, HOW_TO_PLAY_ITEMS } from '../../utils/const';
import HowToPlayItem from './HowToPlayItem';
import AccordionTitle from '../AccordionTitle';

const HowToPlay = () => {
  const [value, setValue] = React.useState<string>('');

  const isOpen = value === ACCORDION_VALUE.HOW_TO_PLAY;

  return (
    <Accordion value={value} onValueChange={setValue} type="single" collapsible className="w-full text-white">
      <AccordionItem value={ACCORDION_VALUE.HOW_TO_PLAY} className="border-b-0 rounded-xl overflow-hidden">
        <AccordionTitle condition={isOpen} title="How to Play" />

        <AccordionContent className="px-5 py-4 border border-navigate-tab rounded-b-xl">
          <VStack spacing={20}>
            {HOW_TO_PLAY_ITEMS?.map((item, index) => (
              <HowToPlayItem key={index} icon={item?.icon} title={item?.title} description={item?.description} />
            ))}
          </VStack>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default HowToPlay;
