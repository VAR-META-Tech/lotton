import * as React from 'react';
import { Icons } from '@/assets/icons';
import { FCC } from '@/types';

import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';

import BuyTicketForm from './BuyTicketForm';
import BuyTicketNote from './BuyTicketNote';

interface Props {
  ticketPrice: number;
}

const BuyTicketDrawer: FCC<Props> = ({ children, ticketPrice }) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="w-full">
          <DrawerHeader className="flex justify-between container">
            <DrawerTitle className="text-white text-2xl font-semibold">Buy Tickets</DrawerTitle>

            <DrawerClose asChild>
              <button>
                <Icons.x className="text-gray-color" />
              </button>
            </DrawerClose>
          </DrawerHeader>
          <div className="border-t-[1px] border-t-gray-color max-h-[70vh] overflow-auto">
            <div className="pt-5 pb-20 px-4 space-y-10 container">
              <div className="text-right">
                <span className="text-xs text-primary underline">How to buy</span>
              </div>

              <div className="space-y-10">
                <BuyTicketForm ticketPrice={ticketPrice} />

                <BuyTicketNote />
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default BuyTicketDrawer;
