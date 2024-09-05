import * as React from 'react';
import { Icons } from '@/assets/icons';
import { FCC } from '@/types';

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';

import BuyTicketForm from './BuyTicketForm';
import BuyTicketNote from './BuyTicketNote';
import { useBuyTicketStore } from '@/stores/BuyTicketStore';
import { useGetPoolDetail } from '@/hooks/useGetPoolDetail';

interface Props {
  poolId: number;
  roundIdOnChain: number;
  poolIdOnChain: number;
}

const BuyTicketDrawer: FCC<Props> = ({ children, poolId, poolIdOnChain, roundIdOnChain }) => {
  const currentPoolId = useBuyTicketStore.use.poolId();
  const setPoolId = useBuyTicketStore.use.setPoolId();

  const { currency, pool } = useGetPoolDetail({
    poolId: poolId || 0,
    isActive: true,
  });

  const handleClose = () => {
    setPoolId(undefined);
  };

  const ticketPrice = Number(pool?.ticketPrice || 0);

  return (
    <Drawer open={currentPoolId === poolId} onClose={handleClose}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="w-full">
          <DrawerHeader className="flex justify-between container">
            <DrawerTitle className="text-white text-2xl font-semibold">Buy Tickets</DrawerTitle>

            <button onClick={handleClose}>
              <Icons.x className="text-gray-color" />
            </button>
          </DrawerHeader>
          <div className="border-t-[1px] border-t-gray-color max-h-[70vh] overflow-auto">
            <div className="pt-5 pb-20 px-4 space-y-10 container">
              <div className="text-right">
                <span className="text-xs text-primary underline">How to buy</span>
              </div>

              <div className="space-y-10">
                <BuyTicketForm
                  ticketPrice={ticketPrice}
                  currency={currency}
                  poolIdOnChain={poolIdOnChain}
                  roundIdOnChain={roundIdOnChain}
                />

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
