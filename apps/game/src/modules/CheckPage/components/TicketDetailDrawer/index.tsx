'use client';

import React, { useMemo } from 'react';
import { Icons } from '@/assets/icons';

import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import YourTickets from './YourTickets';
import { FCC } from '@/types';
import TicketInfo from '../TicketInfo';
import { HStack } from '@/components/ui/Utilities';
import { Button } from '@/components/ui/button';
import { IGetPoolJoinedItem, IGetPoolJoinedItemRound } from '@/apis/pools';
import { useBuyTicketStore } from '@/stores/BuyTicketStore';

type Props = {
  pool: IGetPoolJoinedItem;
  roundActive: IGetPoolJoinedItemRound;
};

export const TicketDetailDrawer: FCC<Props> = ({ children, pool, roundActive }) => {
  const setPoolId = useBuyTicketStore.use.setPoolId();

  const roundActiveInfo = useMemo(() => {
    const round = pool?.rounds?.find((round) => {
      return round?.roundNumber === roundActive?.roundNumber;
    });

    return round;
  }, [roundActive?.roundNumber, pool?.rounds]);

  const isEndRound = useMemo(() => {
    if (!roundActiveInfo?.endTime) return false;

    const roundEndTime = new Date(Number(roundActiveInfo?.endTime) * 1000);
    const now = new Date();

    if (now > roundEndTime) {
      return true;
    }

    return false;
  }, [roundActiveInfo?.endTime]);

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
              <TicketInfo name={pool?.name || ''} roundActiveNumber={roundActive?.roundNumber || 0} />

              <YourTickets roundActiveInfo={roundActiveInfo} />

              {!isEndRound && (
                <HStack pos={'center'}>
                  <Button className="text-white" onClick={() => setPoolId(pool?.id)}>
                    Buy More Ticket
                  </Button>
                </HStack>
              )}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
