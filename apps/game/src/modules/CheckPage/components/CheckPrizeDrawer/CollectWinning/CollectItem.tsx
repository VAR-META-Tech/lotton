import TonImage from '@/components/TonImage';
import { HStack } from '@/components/ui/Utilities';
import { roundNumber } from '@/lib/common';
import React, { FC } from 'react';

interface Props {
  code: string;
  value: number;
}

const CollectItem: FC<Props> = ({ code, value }) => {
  return (
    <HStack pos={'apart'} align={'start'} spacing={32}>
      <span>Ticket: {code || ''}</span>

      <HStack spacing={4}>
        <span className="text-primary text-xl">{roundNumber(value || 0)}</span>

        <TonImage width={24} height={24} />
      </HStack>
    </HStack>
  );
};

export default CollectItem;
