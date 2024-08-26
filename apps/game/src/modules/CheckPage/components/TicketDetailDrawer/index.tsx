'use client';

import React from 'react';
import { Icons } from '@/assets/icons';

import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import YourTickets from './YourTickets';
import { FCC } from '@/types';
import TicketInfo from '../TicketInfo';
import { HStack } from '@/components/ui/Utilities';
import { Button } from '@/components/ui/button';

type Props = {
  name: string;
  activeRound: number;
};

export const TicketDetailDrawer: FCC<Props> = ({ children, name, activeRound }) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="w-full">
          <DrawerHeader className="flex justify-between container">
            <DrawerTitle className="text-white text-2xl font-semibold">Ticket Details</DrawerTitle>

            <DrawerClose>
              <Icons.x className="text-gray-color" />
            </DrawerClose>
          </DrawerHeader>
          <div className="border-t-[1px] max-h-[70vh] overflow-auto border-t-gray-color pt-5 pb-10">
            <div className="container">
              <TicketInfo name={name} activeRound={activeRound} />

              <YourTickets winCode="3789" />

              <HStack pos={'center'}>
                <Button className="text-white">Buy More Ticket</Button>
              </HStack>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
