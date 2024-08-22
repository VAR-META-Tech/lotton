'use client';

import React, { FC, HTMLAttributes } from 'react';
import dynamic from 'next/dynamic';

import { cn } from '@/lib/utils';

import PoolInfo from './PoolInfo';
import PoolPrizePot from './PoolPrizePot';
import PoolRound from './PoolRound';

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
      <PoolRound />

      {/* PRIZE POT */}
      <PoolPrizePot />

      <PoolInfo isShow={isShow} setIsShow={setIsShow} />
    </div>
  );
};

export default PoolCard;
