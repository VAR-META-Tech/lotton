import React, { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { VStack } from '@/components/ui/Utilities';

import { Title } from './Title';
import { CheckPrizeDrawer } from './CheckPrizeDrawer';
import { useWinPools } from '@/hooks/useWinPools';
import { Spinner } from '@/components/ui/spinner';
import { useClaimStore } from '@/stores/ClaimStore';

const CheckWinner = () => {
  const { poolList, isLoading } = useWinPools();
  const setIsOpen = useClaimStore.use.setIsOpen();

  const renderCheckWinner = useMemo(() => {
    if (isLoading) {
      return (
        <VStack spacing={4} justify={'center'} align={'center'}>
          <Spinner size="2rem" />
        </VStack>
      );
    }

    if (!poolList?.length) {
      return (
        <VStack spacing={4} align={'center'} className="bg-[#FFCA3A] border p-4 rounded-lg shadow-sm text-black">
          <span className="text-center text-2xl">No prizes to collect...</span>
          <span className="text-center text-2xl">Better luck next time!</span>
        </VStack>
      );
    }

    return (
      <VStack spacing={16} align={'center'} className="bg-[#FFCA3A] border p-4 rounded-lg shadow-sm">
        <Title title="You have already won!" className="text-black" />

        <Button onClick={() => setIsOpen(true)} size={'lg'} className="rounded-lg w-fit bg-secondary text-white">
          WATCH PRIZES
        </Button>

        <CheckPrizeDrawer poolList={poolList} />
      </VStack>
    );
  }, [isLoading, poolList, setIsOpen]);

  return renderCheckWinner;
};

export default CheckWinner;
