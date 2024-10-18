import * as React from 'react';
import { Icons } from '@/assets/icons';
import { FCC } from '@/types';

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';

import BuyTicketForm from './BuyTicketForm';
import BuyTicketNote from './BuyTicketNote';
import { useBuyTicketStore } from '@/stores/BuyTicketStore';
import { IGetPoolDetailData, IGetPoolDetailRound } from '@/apis/pools';

interface Props {
  pool: IGetPoolDetailData | undefined;
  roundActive: IGetPoolDetailRound;
}

const BuyTicketDrawer: FCC<Props> = ({ pool, roundActive, children }) => {
  const currentPoolId = useBuyTicketStore.use.poolId();
  const setPoolId = useBuyTicketStore.use.setPoolId();

  return (
    <Drawer open={pool?.id ? currentPoolId === pool?.id : false} onClose={() => setPoolId(undefined)}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="w-full">
          <DrawerHeader className="flex justify-between container">
            <DrawerTitle className="text-white text-2xl font-semibold">Buy Tickets</DrawerTitle>

            <button onClick={() => setPoolId(undefined)}>
              <Icons.x className="text-gray-color" />
            </button>
          </DrawerHeader>
          <div className="border-t-[1px] border-t-gray-color max-h-[70vh] overflow-auto">
            <div className="pt-5 pb-20 px-4 space-y-10 container">
              <div className="text-right">
                <span className="text-xs text-primary underline">How to buy</span>
              </div>

              <div className="space-y-10">
                <BuyTicketForm pool={pool} roundActive={roundActive} />

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
