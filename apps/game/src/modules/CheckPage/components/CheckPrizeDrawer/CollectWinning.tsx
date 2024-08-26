import { Button } from '@/components/ui/button';
import { HStack, VStack } from '@/components/ui/Utilities';
import React from 'react';

const CollectWinning = () => {
  const handleClaim = () => {
    console.log('claim');
  };

  return (
    <VStack className="container">
      <VStack>
        <CollectItem />
        <CollectItem />
        <CollectItem />
      </VStack>

      <CollectTotal />

      <HStack pos={'center'}>
        <Button onClick={handleClaim} size={'lg'} className="rounded-lg w-fit bg-primary text-white">
          Claim
        </Button>
      </HStack>
    </VStack>
  );
};

export default CollectWinning;

const CollectItem = () => {
  return (
    <VStack>
      <HStack pos={'apart'}>
        <span>Round 1</span>

        <span>Ticket: b2ad</span>
      </HStack>

      <HStack pos={'apart'}>
        <span className="text-primary text-2xl">10.500000 NOT</span>

        <span className="text-gray-color text-sm">~ 10.500000 USD</span>
      </HStack>
    </VStack>
  );
};

const CollectTotal = () => {
  return (
    <VStack className="border-t border-t-gray-color">
      <span>Total Unclaimed Rewards</span>

      <HStack pos={'apart'} className="font-bold">
        <span className="text-primary text-2xl">10.500000 NOT</span>

        <span className="text-gray-color text-sm">~ 10.500000 USD</span>
      </HStack>
    </VStack>
  );
};
