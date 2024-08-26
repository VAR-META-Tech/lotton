import React, { FC } from 'react';
import Image from 'next/image';

import { prettyNumber } from '@/lib/common';
import { HStack, VStack } from '@/components/ui/Utilities';

import PoolAction from './PoolAction';

interface Props {
  ticketPrice: number;
}

const PoolPrizePot: FC<Props> = ({ ticketPrice }) => {
  return (
    <div className="p-5 border border-navigate-tab min-h-[12.875rem]">
      <VStack align={'center'}>
        <div className="text-white">
          <div className="text-center">Prize Pot</div>

          <HStack pos={'center'} spacing={8}>
            <Image src={'/images/tokens/ton_symbol.webp'} width={30} height={30} alt="ton" />
            <span className="text-primary text-2xl font-semibold">{`${prettyNumber(2500)} TON`}</span>
          </HStack>

          <div className="text-xs text-gray-color text-center">{`~ ${prettyNumber(10000)} USD`}</div>
        </div>

        <PoolAction holdingTicket={0} ticketPrice={ticketPrice} />
      </VStack>
    </div>
  );
};

export default PoolPrizePot;
