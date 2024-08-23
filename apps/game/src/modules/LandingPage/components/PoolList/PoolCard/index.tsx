'use client';

import React, { FC, HTMLAttributes, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { MIN_ROUND } from '@/modules/LandingPage/utils/const';

import { cn } from '@/lib/utils';
import { useGetPoolDetail } from '@/hooks/useGetPoolDetail';

import PoolInfo from './PoolInfo';
import PoolPrizePot from './PoolPrizePot';
import PoolRound from './PoolRound';

const PoolCountDown = dynamic(() => import('./PoolCountDown'), { ssr: false });

interface Props extends HTMLAttributes<HTMLDivElement> {
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
  poolId: number;
  isActive: boolean;
}

const PoolCard: FC<Props> = ({ poolId, isShow, setIsShow, className, isActive, ...props }) => {
  const [currentRound, setCurrentRound] = useState<number>(MIN_ROUND);

  const { pool, rounds } = useGetPoolDetail({ poolId, isActive });

  const roundActive = useMemo(() => rounds?.find((item) => item.roundNumber === currentRound), [currentRound, rounds]);

  return (
    <div {...props} className={cn('w-full rounded-xl overflow-hidden', className)}>
      <div className="bg-navigate-tab py-1.5 h-[4.25rem]">
        <div className="text-primary text-2xl font-semibold text-center">{pool?.name}</div>

        <PoolCountDown date={roundActive?.endTime} />
      </div>

      <PoolRound
        rounds={rounds}
        minRound={MIN_ROUND}
        maxRound={pool?.totalRounds || 0}
        currentRound={currentRound}
        setCurrentRound={setCurrentRound}
        date={roundActive?.endTime}
      />

      <PoolPrizePot />

      <PoolInfo isShow={isShow} setIsShow={setIsShow} />
    </div>
  );
};

export default PoolCard;
