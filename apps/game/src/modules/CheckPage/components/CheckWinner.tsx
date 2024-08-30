import React, { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { VStack } from '@/components/ui/Utilities';

import { Title } from './Title';
import { CheckPrizeDrawer } from './CheckPrizeDrawer';
import { useWinPools } from '@/hooks/useWinPools';

export const CheckWinner = () => {
  const { poolList } = useWinPools();

  const renderCheckWinner = useMemo(() => {
    if (!poolList?.length) {
      return (
        <VStack spacing={4} justify={'center'} align={'center'}>
          <span className="text-center text-2xl">No prizes to collect...</span>
          <span className="text-center text-2xl">Better luck next time!</span>
        </VStack>
      );
    }

    return (
      <VStack spacing={16} align={'center'}>
        <Title title="Are you a winner?" />

        <CheckPrizeDrawer>
          <Button size={'lg'} className="rounded-lg w-fit bg-gradient-to-r from-primary to-[#ED9BD6] text-white">
            CHECK NOW
          </Button>
        </CheckPrizeDrawer>
      </VStack>
    );
  }, [poolList?.length]);

  return renderCheckWinner;
};
