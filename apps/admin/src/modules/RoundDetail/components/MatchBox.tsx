import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

import { cn } from '@/lib/utils';
import { HStack, VStack } from '@/components/ui/Utilities';

type Props = {
  matchNum: number;
  ticket: string;
  index: number;
};

const MatchBox = ({ matchNum, ticket = 'a3b7', index }: Props) => {
  return (
    <HStack spacing={12} className="items-end">
      <p className="text-sm text-black mb-1">Ticket {index}</p>

      <VStack spacing={4}>
        <p className="text-sm text-[#FFBF00]">Matched first {matchNum}</p>

        <HStack
          pos={'apart'}
          className={cn(
            'rounded-md h-[2.125rem] w-[14rem] relative z-0',
            'before:border before:border-[#8B8B94] before:w-full before:h-full before:absolute before:rounded-md z-10',
            'after:border after:border-[#FFBF00] after:rounded-md after:absolute after:h-full z-20',
            matchNum === 0 && 'after:hidden',
            matchNum === 1 && 'after:w-1/4',
            matchNum === 2 && 'after:w-2/4',
            matchNum === 3 && 'after:w-3/4',
            matchNum === 4 && 'after:w-full'
          )}
        >
          {ticket.split('').map((ticket) => (
            <div className="flex-1 text-center" key={`${ticket}_${index}`}>
              {ticket}
            </div>
          ))}
        </HStack>
      </VStack>

      {/* <Link href={'/'}>
        <ExternalLink className="text-[#8B8B94] mb-1" />
      </Link> */}
    </HStack>
  );
};

export default MatchBox;
