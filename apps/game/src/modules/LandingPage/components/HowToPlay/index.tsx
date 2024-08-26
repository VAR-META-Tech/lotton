'use client';

import React from 'react';
import { Icons } from '@/assets/icons';

import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HStack, VStack } from '@/components/ui/Utilities';

import { ACCORDION_VALUE } from '../../utils/const';
import HowToPlayItem from './HowToPlayItem';

const HOW_TO_PLAY_ITEMS = [
  {
    icon: <Icons.ticket className="text-primary w-[1.375rem] h-[1.125rem]" />,
    title: 'Get your Tickets',
    description: 'Price and limit (per transaction) are set each round. Ticket sales close an hour before draw.',
  },
  {
    icon: <Icons.calendar className="stroke-primary" />,
    title: 'Watch the Time',
    description: 'Then the count down ends, the next block will be pulled and drawing will commence.',
  },
  {
    icon: <Icons.ticketStar className="stroke-primary" />,
    title: 'Become a Winer',
    description: (
      <ul className="list-disc pl-4 text-gray-color text-xs">
        <li>Once the round is over, come back to the page and check to see if you’ve won!</li>
        <li>If your ticket values match the winning ticket in sequential order, then you are a winner!</li>
      </ul>
    ),
  },
];

const HowToPlay = () => {
  const [value, setValue] = React.useState<string>('');

  const isOpen = value === ACCORDION_VALUE.HOW_TO_PLAY;

  return (
    <Accordion value={value} onValueChange={setValue} type="single" collapsible className="w-full text-white">
      <AccordionItem value={ACCORDION_VALUE.HOW_TO_PLAY} className="border-b-0 rounded-xl overflow-hidden">
        <AccordionTrigger
          className="text-2xl bg-navigate-tab px-5 py-4 font-normal"
          suffix={
            <HStack spacing={12} className="text-gray-color">
              <span className="text-base">{isOpen ? 'Hide' : 'Detail'}</span>
              <Icons.chevronDown
                className={cn('h-4 w-4 shrink-0 transition-transform duration-200', {
                  'rotate-180': isOpen,
                })}
              />
            </HStack>
          }
        >
          How to Play
        </AccordionTrigger>

        <AccordionContent className="px-5 py-4 border border-navigate-tab rounded-b-xl">
          <VStack spacing={20}>
            {HOW_TO_PLAY_ITEMS?.map((item, index) => (
              <HowToPlayItem key={index} icon={item.icon} title={item.title} description={item.description} />
            ))}
          </VStack>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default HowToPlay;
