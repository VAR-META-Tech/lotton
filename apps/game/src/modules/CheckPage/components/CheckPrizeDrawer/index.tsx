'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Icons } from '@/assets/icons';

import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { FCC } from '@/types';
import { Button } from '@/components/ui/button';
import CheckPrize from './CheckPrize';
import { STEP_VALUE } from '../../utils/const';
import { HStack, VStack } from '@/components/ui/Utilities';
import CollectWinning from './CollectWinning';

type TicketPool = {};

type Props = {
  ticketPools: TicketPool[];
};

export const CheckPrizeDrawer: FCC<Props> = ({ children, ticketPools = [] }) => {
  const [step, setStep] = useState(STEP_VALUE.CHECK_PRIZE);

  const titleDraw = useMemo(() => {
    if (ticketPools.length === 0) return 'Check Prizes';

    if (ticketPools.length === 1) return 'TON Pool - Round 1';

    return 'Check Prizes';
  }, [ticketPools.length]);

  const renderTitle = useCallback(() => {
    if (step === STEP_VALUE.CHECK_PRIZE) {
      return titleDraw;
    }

    return 'Collect Winning';
  }, [step, titleDraw]);

  const handleChangeStep = useCallback(() => {
    if (step === STEP_VALUE.CLAIM) return;

    setStep(STEP_VALUE.CLAIM);
  }, [step]);

  const renderContent = useCallback(() => {
    if (step === STEP_VALUE.CHECK_PRIZE) {
      return (
        <VStack>
          <CheckPrize name="TON Pool" round={1} winCode="1234" isOnlyOneTicket={ticketPools.length !== 1}></CheckPrize>

          <HStack pos={'center'}>
            <Button
              onClick={() => handleChangeStep()}
              size={'lg'}
              className="rounded-lg w-fit bg-gradient-to-r from-primary to-[#ED9BD6] text-white"
            >
              Collect Prizes
            </Button>
          </HStack>
        </VStack>
      );
    }

    return <CollectWinning />;
  }, [handleChangeStep, step, ticketPools.length]);

  return (
    <Drawer onOpenChange={() => setStep(STEP_VALUE.CHECK_PRIZE)}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="w-full">
          <DrawerHeader className="flex justify-between container">
            <DrawerTitle className="text-white text-2xl font-semibold">{renderTitle()}</DrawerTitle>

            <DrawerClose>
              <Icons.x className="text-gray-color" />
            </DrawerClose>
          </DrawerHeader>
          <div className="border-t-[1px] max-h-[70vh] overflow-auto border-t-gray-color pt-5 pb-10">
            {renderContent()}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
