'use client';

import React, { useMemo } from 'react';
import { Icons } from '@/assets/icons';

import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import YourTickets from './YourTickets';
import { FCC } from '@/types';
import TicketInfo from '../TicketInfo';
import { HStack } from '@/components/ui/Utilities';
import { Button } from '@/components/ui/button';
import { IGetPoolJoinedItem } from '@/apis/pools';
import { useBuyTicketStore } from '@/stores/BuyTicketStore';

type Props = {
  pool: IGetPoolJoinedItem;
  roundActiveNumber: number;
};

export const TicketDetailDrawer: FCC<Props> = ({ children, pool, roundActiveNumber }) => {
  const setPoolId = useBuyTicketStore.use.setPoolId();

  const roundActiveInfo = useMemo(() => {
    const round = pool?.rounds?.find((round) => {
      return round?.roundNumber === roundActiveNumber;
    });
    console.log('🚀 ~ roundActiveInfo ~ round:', round);
    return round;
  }, [roundActiveNumber, pool?.rounds]);

  const isEndRound = useMemo(() => {
    if (!roundActiveInfo?.endTime) return false;

    const roundEndtime = new Date(roundActiveInfo?.endTime);
    const now = new Date();

    if (now > roundEndtime) {
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
              <TicketInfo name={pool?.name || ''} roundActiveNumber={roundActiveNumber} />

              <YourTickets winCode={roundActiveInfo?.winningCode || '    '} roundInfo={roundActiveInfo} />

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
