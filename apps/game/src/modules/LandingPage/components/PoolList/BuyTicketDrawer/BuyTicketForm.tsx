import React, { useState } from 'react';
import Image from 'next/image';
import { Icons } from '@/assets/icons';
import { MAX_TICKET, MIN_TICKET } from '@/modules/LandingPage/utils/const';

import { prettyNumber } from '@/lib/common';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { HStack, VStack } from '@/components/ui/Utilities';

const BuyTicketForm = () => {
  const [amount, setAmount] = useState(0);

  const isMax = amount === MAX_TICKET;
  const isMin = amount === MIN_TICKET;

  const onAmountChange = (type: 'plus' | 'minus') => {
    if ((isMin && type === 'minus') || (isMax && type === 'plus')) return;

    if (type === 'plus') {
      setAmount((prev) => prev + 1);
      return;
    }

    setAmount((prev) => prev - 1);
  };

  return (
    <VStack spacing={24}>
      <VStack spacing={20} className="text-white border-b-[1px] border-b-gray-color pb-6">
        <HStack pos={'apart'}>
          <span className="text-base font-medium">Ticket Price:</span>

          <HStack spacing={8}>
            <Image src={'/images/tokens/ton_symbol.webp'} width={24} height={24} alt="ton" />

            <span className="text-2xl">{`10 TON`}</span>
          </HStack>
        </HStack>

        <HStack pos={'apart'}>
          <span className="text-base font-medium">Amount</span>

          <HStack spacing={8}>
            <button
              onClick={() => onAmountChange('minus')}
              disabled={isMin}
              className={cn(
                'bg-white border border-primary rounded-[0.3125rem] w-[2.1875rem] h-[1.6875rem] flex justify-center items-center',
                {
                  'border-gray-color': isMin,
                }
              )}
            >
              <Icons.minus
                className={cn('text-primary', {
                  'text-gray-color': isMin,
                })}
              />
            </button>

            <span className="text-2xl font-semibold w-8 text-center">{amount}</span>

            <button
              onClick={() => onAmountChange('plus')}
              disabled={isMax}
              className={cn(
                'bg-white border border-primary rounded-[0.3125rem] w-[2.1875rem] h-[1.6875rem] flex justify-center items-center',
                {
                  'border-gray-color': isMax,
                }
              )}
            >
              <Icons.plus
                className={cn('text-primary', {
                  'text-gray-color': isMax,
                })}
              />
            </button>
          </HStack>
        </HStack>
      </VStack>

      <VStack spacing={0}>
        <HStack pos={'apart'} className="text-white">
          <span className="text-base font-bold">You pay:</span>

          <HStack spacing={8}>
            <Image src={'/images/tokens/ton_symbol.webp'} width={24} height={24} alt="ton" />

            <span className="text-2xl">{`10 TON`}</span>
          </HStack>
        </HStack>
        <HStack pos={'apart'}>
          <span className="text-xs text-white">{`TON balance: ${prettyNumber(10000)} TON`}</span>

          <span className="text-base text-gray-color">{`~ ${prettyNumber(0)} TON`}</span>
        </HStack>
      </VStack>

      <Button size={'lg'} className="text-base font-medium mt-10">
        Buy
      </Button>
    </VStack>
  );
};

export default BuyTicketForm;
