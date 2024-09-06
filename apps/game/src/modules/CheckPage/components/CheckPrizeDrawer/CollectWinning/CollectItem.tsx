import { HStack, VStack } from '@/components/ui/Utilities';
import { roundNumber } from '@/lib/common';
import React, { FC } from 'react';

interface Props {
  roundClaimNumber: number;
  code: string;
  tokenSymbol: string;
  value: number;
  usdValue: number;
}

const CollectItem: FC<Props> = ({ roundClaimNumber, code, tokenSymbol, value, usdValue }) => {
  return (
    <VStack>
      <HStack pos={'apart'}>
        <span>Round {roundClaimNumber || 0}</span>

        <span>Ticket: {code || ''}</span>
      </HStack>

      <HStack pos={'apart'}>
        <span className="text-primary text-2xl">{`${roundNumber(value || 0)} ${tokenSymbol || ''}`}</span>

        <span className="text-gray-color text-sm">~ {roundNumber(usdValue || 0)} USD</span>
      </HStack>
    </VStack>
  );
};

export default CollectItem;
