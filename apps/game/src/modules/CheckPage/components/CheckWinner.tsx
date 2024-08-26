import React from 'react';

import { Button } from '@/components/ui/button';
import { VStack } from '@/components/ui/Utilities';

import { Title } from './Title';
import { CheckPrizeDrawer } from './CheckPrizeDrawer';

export const CheckWinner = () => {
  return (
    <VStack spacing={16} align={'center'}>
      <Title title="Are you a winner?" />

      <CheckPrizeDrawer ticketPools={[]}>
        <Button size={'lg'} className="rounded-lg w-fit bg-gradient-to-r from-primary to-[#ED9BD6] text-white">
          CHECK NOW
        </Button>
      </CheckPrizeDrawer>
    </VStack>
  );
};
