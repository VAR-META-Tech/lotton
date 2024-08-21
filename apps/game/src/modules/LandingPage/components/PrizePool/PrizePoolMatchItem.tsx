import React, { FC } from 'react';
import { Icons } from '@/assets/icons';

import { HStack } from '@/components/ui/Utilities';

interface Props {
  title: string;
  value: string;
}

const PrizePoolMatchItem: FC<Props> = ({ title, value }) => {
  return (
    <HStack pos={'apart'} className="text-xs">
      <HStack spacing={8}>
        <Icons.ball />

        <span>{title}</span>
      </HStack>

      <span>{value}</span>
    </HStack>
  );
};

export default PrizePoolMatchItem;
