import { HStack, VStack } from '@/components/ui/Utilities';
import React, { FC } from 'react';

interface Props {
  roundNumber: number;
  code: string;
  tokenSymbol: string;
  value: number;
  usdValue: number;
}

const CollectItem: FC<Props> = ({ roundNumber, code, tokenSymbol, value, usdValue }) => {
  return (
    <VStack>
      <HStack pos={'apart'}>
        <span>Round {roundNumber || 0}</span>

        <span>Ticket: {code || ''}</span>
      </HStack>

      <HStack pos={'apart'}>
        <span className="text-primary text-2xl">{`${Number(value || 0).toFixed(6)} ${tokenSymbol || ''}`}</span>

        <span className="text-gray-color text-sm">~ {Number(usdValue || 0).toFixed(6)} USD</span>
      </HStack>
    </VStack>
  );
};

export default CollectItem;
