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
        <VStack spacing={4} justify={'center'} align={'center'}>
          <span className="text-center text-2xl">No prizes to collect...</span>
          <span className="text-center text-2xl">Better luck next time!</span>
        </VStack>
      );
    }

    return (
      <VStack spacing={16} align={'center'}>
        <Title title="Are you a winner?" />

        <Button
          onClick={() => setIsOpen(true)}
          size={'lg'}
          className="rounded-lg w-fit bg-gradient-to-r from-primary to-[#ED9BD6] text-white"
        >
          CHECK NOW
        </Button>

        <CheckPrizeDrawer poolList={poolList} />
      </VStack>
    );
  }, [isLoading, poolList, setIsOpen]);

  return renderCheckWinner;
};

export default CheckWinner;
