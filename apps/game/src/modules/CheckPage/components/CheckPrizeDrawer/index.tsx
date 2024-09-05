'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Icons } from '@/assets/icons';

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { FCC } from '@/types';
import { VStack } from '@/components/ui/Utilities';
import CollectWinning from './CollectWinning';
import { useWinPools } from '@/hooks/useWinPools';
import PrizeItem from './PrizeItem';
import { useClaimStore } from '@/stores/ClaimStore';

export interface IClaimStep {
  poolId: number | null;
  roundId: number | null;
}

export const CheckPrizeDrawer: FCC = ({ children }) => {
  const isOpen = useClaimStore.use.isOpen();
  const setIsOpen = useClaimStore.use.setIsOpen();
  const { poolList } = useWinPools();
  const [claimStep, setClaimStep] = useState<IClaimStep>({
    poolId: null,
    roundId: null,
  });

  const titleDraw = useMemo(() => {
    if (poolList.length === 0) return 'Check Prizes';

    if (poolList.length === 1 && poolList[0]?.rounds?.length === 1) {
      return `${poolList[0]?.name} - Round ${poolList[0]?.rounds[0]?.roundNumber}`;
    }

    return 'Check Prizes';
  }, [poolList]);

  const renderTitle = useCallback(() => {
    if (!claimStep?.poolId && !claimStep?.roundId) {
      return titleDraw;
    }

    return 'Collect Winning';
  }, [claimStep, titleDraw]);

  const renderContent = useCallback(() => {
    if (!claimStep?.poolId && !claimStep?.roundId) {
      return (
        <VStack spacing={40}>
          {poolList?.map((pool) => {
            return pool?.rounds?.map((round, index) => (
              <PrizeItem
                key={`${pool?.id}-${round?.id}-${index}`}
                pool={pool}
                round={round}
                handleChangeStep={() => {
                  if (!!claimStep?.poolId && !!claimStep?.roundId) return;

                  setClaimStep({
                    poolId: pool?.id,
                    roundId: round?.id,
                  });
                }}
              />
            ));
          })}
        </VStack>
      );
    }

    return <CollectWinning poolId={claimStep?.poolId || 0} roundId={claimStep?.roundId || 0} />;
  }, [claimStep?.poolId, claimStep?.roundId, poolList]);

  return (
    <Drawer
      open={isOpen}
      onOpenChange={() => setClaimStep({ poolId: null, roundId: null })}
      onClose={() => setIsOpen(false)}
    >
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="w-full">
          <DrawerHeader className="flex justify-between container">
            <DrawerTitle className="text-white text-2xl font-semibold">{renderTitle()}</DrawerTitle>

            <button onClick={() => setIsOpen(false)}>
              <Icons.x className="text-gray-color" />
            </button>
          </DrawerHeader>
          <div className="border-t-[1px] max-h-[70vh] overflow-auto border-t-gray-color pt-5 pb-10">
            {renderContent()}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
