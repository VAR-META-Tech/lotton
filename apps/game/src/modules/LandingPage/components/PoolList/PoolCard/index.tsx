'use client';

import React, { FC, HTMLAttributes, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Icons } from '@/assets/icons';

import { prettyNumber } from '@/lib/common';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { HStack, VStack } from '@/components/ui/Utilities';

import PoolInfo from './PoolInfo';

const PoolCountDown = dynamic(() => import('./PoolCountDown'), { ssr: false });

interface Props extends HTMLAttributes<HTMLDivElement> {
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const PoolCard: FC<Props> = ({ isShow, setIsShow, className, ...props }) => {
  return (
    <div {...props} className={cn('w-full rounded-xl overflow-hidden', className)}>
      <div className="bg-navigate-tab py-1.5">
        <div className="text-primary text-2xl font-semibold text-center">TON Pool</div>

        <PoolCountDown date="2024-08-30T22:00:00" />
      </div>

      {/* ROUND */}
      <div className="border-x-navigate-tab border-x text-white px-5 py-4">
        <HStack pos={'apart'} spacing={12}>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Round</span>{' '}
              <span className="bg-navigate-tab px-3 py-1 rounded-lg">03</span>
            </div>

            <div className="text-xs">Draw Aug 16, 2024, 10:00 PM</div>
          </div>

          <div className="space-x-5">
            <button>
              <Icons.arrowLeft color="#fff" />
            </button>
            <button>
              <Icons.arrowRight color="#fff" />
            </button>
          </div>
        </HStack>
      </div>

      {/* PRIZE POT */}
      <div className="p-5 border border-navigate-tab">
        <VStack align={'center'}>
          <div className="text-white">
            <div className="text-center">Prize Pot</div>

            <HStack pos={'center'} spacing={8}>
              <Image src={'/images/tokens/ton_symbol.webp'} width={30} height={30} alt="ton" />
              <span className="text-primary text-2xl font-semibold">{`${prettyNumber(2500)} TON`}</span>
            </HStack>

            <div className="text-xs text-gray-color text-center">{`~ ${prettyNumber(10000)} USD`}</div>
          </div>

          <Button className="rounded-lg">Connect Wallet</Button>
        </VStack>
      </div>

      <PoolInfo isShow={isShow} setIsShow={setIsShow} />
    </div>
  );
};

export default PoolCard;
