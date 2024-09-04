'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Icons } from '@/assets/icons';

import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { FCC } from '@/types';
import { VStack } from '@/components/ui/Utilities';
import CollectWinning from './CollectWinning';
import { useWinPools } from '@/hooks/useWinPools';
import PrizeItem from './PrizeItem';

interface IClaimStepProps {
  poolId: number | null;
  roundId: number | null;
}

export const CheckPrizeDrawer: FCC = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { poolList } = useWinPools();
  const [claimStep, setClaimStep] = useState<IClaimStepProps>({
    poolId: null,
    roundId: null,
  });

  const handleOpenChange = () => {
    setClaimStep({ poolId: null, roundId: null });
    setIsOpen(false);
  };

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

  const handleChangeStep = useCallback(
    (poolId: number, roundId: number) => {
      if (!!claimStep?.poolId && !!claimStep?.roundId) return;

      setClaimStep({
        poolId,
        roundId,
      });
    },
    [claimStep?.poolId, claimStep?.roundId]
  );

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
                handleChangeStep={() => handleChangeStep(pool?.id, round?.id)}
              />
            ));
          })}
        </VStack>
      );
    }

    return <CollectWinning poolId={claimStep?.poolId || 0} roundId={claimStep?.roundId || 0} />;
  }, [claimStep?.poolId, claimStep?.roundId, handleChangeStep, poolList]);

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
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
