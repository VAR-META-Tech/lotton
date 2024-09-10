'use client';

import React from 'react';

import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion';
import { HStack } from '@/components/ui/Utilities';

import { ACCORDION_VALUE } from '../../utils/const';
import PrizePoolMatchItem from './PrizePoolMatchItem';
import AccordionTitle from '../AccordionTitle';

const PrizePool = () => {
  const [value, setValue] = React.useState<string>('');

  const isOpen = value === ACCORDION_VALUE.PRIZE_POOL;

  return (
    <Accordion value={value} onValueChange={setValue} type="single" collapsible className="w-full text-white">
      <AccordionItem value={ACCORDION_VALUE.PRIZE_POOL} className="border-b-0 rounded-xl overflow-hidden">
        <AccordionTitle condition={isOpen} title="Prize Pool" />

        <AccordionContent className="px-5 py-4 border border-navigate-tab rounded-b-xl space-y-5">
          <div className="space-y-2">
            <span>Funding Sources</span>
            <ul className="list-disc pl-4 text-xs text-gray-color">
              <li>
                The Prize Pool itself is made up of both ticket purchases, and rollover prizes from prior rounds without
                winners.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <span>Allocations</span>
            <ul className="list-disc pl-4 text-xs text-gray-color">
              <li>
                When multiple users have won in the same bracket their prizes are split evenly among that bracket.
              </li>
              <li>A user who has “Match First 3” does not also get the winnings for 'Match First 2' and so on.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <HStack spacing={4} pos={'apart'} className="text-[10px] font-bold text-primary" noWrap>
              <span>VALUES MATCHED</span>
              <span>PRIZE POOL ALLOCATION</span>
            </HStack>

            <PrizePoolMatchItem title="Marches first 1" value="7%" />
            <PrizePoolMatchItem title="Marches first 2" value="25%" />
            <PrizePoolMatchItem title="Marches first 3" value="20%" />
            <PrizePoolMatchItem title="Marches first 4" value="48%" />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default PrizePool;
