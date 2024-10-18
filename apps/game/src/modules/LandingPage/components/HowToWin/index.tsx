'use client';

import React from 'react';
import Image from 'next/image';

import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion';

import { ACCORDION_VALUE } from '../../utils/const';
import AccordionTitle from '../AccordionTitle';

const HowToWin = () => {
  const [value, setValue] = React.useState<string>('');

  const isOpen = value === ACCORDION_VALUE.HOW_TO_WIN;

  return (
    <Accordion value={value} onValueChange={setValue} type="single" collapsible className="w-full text-white">
      <AccordionItem value={ACCORDION_VALUE.HOW_TO_WIN} className="border-b-0 rounded-xl overflow-hidden">
        <AccordionTitle condition={isOpen} title="How to Win" />

        <AccordionContent className="px-5 py-4 border border-navigate-tab rounded-b-xl space-y-5">
          <span className="text-base">Each value must match in order to win.</span>

          <div className="text-xs">
            <p className="text-gray-color">For example:</p>
            <ul className="list-disc pl-4 text-primary">
              <li>
                <span className="font-bold">A</span>{' '}
                <span className="text-gray-color">
                  - The first three values match, and in order. The fourth doest not match, thus the user wins in the
                  “Match First 3” prize bracket.
                </span>
              </li>
              <li>
                <span className="font-bold">B</span>{' '}
                <span className="text-gray-color">
                  - Even though 3 of the digits match, the first does not. This is no prize
                </span>
              </li>
            </ul>
          </div>

          <div className="w-4/5 relative h-48 mx-auto">
            <Image
              src="/images/how_to_win.webp"
              alt="how-to-win"
              fill
              priority
              quality={100}
              className="object-contain"
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default HowToWin;
