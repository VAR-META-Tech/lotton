'use client';

import React, { PropsWithChildren, useCallback, useMemo } from 'react';
import { Icons } from '@/assets/icons';

import { cn } from '@/lib/utils';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { HStack, VStack } from '@/components/ui/Utilities';

type TicketPool = {};

type Props = {
  ticketPools: TicketPool[];
};

export const TicketDetailsDrawer = ({ children, ticketPools = [] }: PropsWithChildren<Props>) => {
  const titleDraw = useMemo(() => {
    if (ticketPools.length === 0) return 'Checking Prizes';
    if (ticketPools.length === 1) return 'TON Pool - Round 1';
    return 'Check Prizes';
  }, [ticketPools.length]);

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="w-full">
          <DrawerHeader className="flex justify-between container">
            <DrawerTitle className="text-white text-2xl font-semibold">{titleDraw}</DrawerTitle>

            <DrawerClose>
              <Icons.x className="text-gray-color" />
            </DrawerClose>
          </DrawerHeader>
          <div className="border-t-[1px] max-h-[70vh] overflow-auto">
            <WinningNumber code={undefined} />

            <YourTickets winCode="1234" />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

type WinningNumberProps = {
  code?: string;
};
const WinningNumber = ({ code = '    ' }: WinningNumberProps) => {
  const codeSplit = code.split('');
  return (
    <div className="border-t-gray-color border">
      <VStack className="container p-4 py-8" spacing={32}>
        <p className="font-bold">WINNING NUMBER</p>

        <HStack spacing={32} pos={'center'}>
          {codeSplit.map((codeItem, index) => (
            <CodeItem code={codeItem} key={index} />
          ))}
        </HStack>
      </VStack>
    </div>
  );
};

const CodeItem = ({ code }: { code: string }) => (
  <div className="inline-flex text-[1.625rem] items-center justify-center text-center font-bold w-[2.1875rem] aspect-square rounded-full bg-gradient-to-r from-primary to-[#ED9BD6]">
    {code}
  </div>
);

const YourTickets = ({ winCode }: { winCode: string }) => {
  const getMatch = useCallback(
    (code: string) => {
      for (let index = winCode.length; index >= 0; index--) {
        if (code.slice(0, index) === winCode.slice(0, index)) return index;
      }

      return 0;
    },
    [winCode]
  );

  return (
    <div className="border-t-gray-color border">
      <VStack className="container p-4 py-8" spacing={32}>
        <VStack spacing={8}>
          <p className="font-bold">YOUR TICKET</p>

          <VStack spacing={16} justify={'center'}>
            <SummaryTickets
              title="Total tickets:"
              total={10}
              icon={<Icons.ticket width={25} height={20} className="text-primary" />}
            />
            <SummaryTickets
              title="Wining tickets:"
              total={10}
              icon={<Icons.bookmark width={30} height={30} className="text-primary" />}
            />
          </VStack>
        </VStack>

        <VStack spacing={32}>
          <TicketMatch code="1234" ticketNumber={2} matched={getMatch('1234')} />
          <TicketMatch code="1233" ticketNumber={4} matched={getMatch('1233')} />
          <TicketMatch code="1212" ticketNumber={5} matched={getMatch('1212')} />
          <TicketMatch code="1313" ticketNumber={6} matched={getMatch('1313')} />
          <TicketMatch code="2234" ticketNumber={7} matched={getMatch('2234')} />
        </VStack>
      </VStack>
    </div>
  );
};

const SummaryTickets = ({ icon, title, total }: { icon: React.ReactNode; title: string; total: number }) => {
  const totalNumber = total < 10 ? `0${total}` : total;
  return (
    <HStack pos={'apart'} spacing={16} align={'center'}>
      <HStack align={'center'}>
        <div className="w-[1.875rem] aspect-square">{icon}</div>

        <span className="font-bold">{title}</span>
      </HStack>

      <span className="font-bold">{totalNumber}</span>
    </HStack>
  );
};

const TicketMatch = ({ code, ticketNumber, matched = 0 }: { code: string; ticketNumber: number; matched: number }) => {
  const codeSplit = code.split('');

  const getMatchedTitle = () => {
    if (matched === 0) return '';
    if (matched === code.length) return 'Matched full';
    return 'Matched first ' + matched;
  };

  return (
    <div className="grid grid-cols-10 gap-[.625rem] items-center">
      <div className="col-span-2">{`Ticket ${ticketNumber}`}</div>
      <div className="col-span-7">
        <HStack
          pos={'apart'}
          className={cn(
            'rounded-md h-[2.125rem] relative z-0',
            'before:border before:border-gray-color before:w-full before:h-full before:absolute before:rounded-md z-10',
            'after:border after:border-primary after:rounded-md after:absolute after:h-full z-20',
            matched === 0 && 'after:hidden',
            matched === 1 && 'after:w-1/4',
            matched === 2 && 'after:w-2/4',
            matched === 3 && 'after:w-3/4',
            matched === 4 && 'after:w-full'
          )}
        >
          {codeSplit.map((codeItem, index) => (
            <div className={cn('flex-1 flex items-center justify-center text-[1.5rem]')} key={index}>
              {codeItem}
            </div>
          ))}

          <p className="absolute top-0 text-primary -translate-y-full">{getMatchedTitle()}</p>
        </HStack>
      </div>
      <div className="col-span-1">
        <Icons.newTab className="text-gray-color" />
      </div>
    </div>
  );
};
