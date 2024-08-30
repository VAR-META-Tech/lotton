'use client';

import React, { FC, HTMLAttributes, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { MIN_ROUND } from '@/modules/LandingPage/utils/const';

import { cn } from '@/lib/utils';
import { useGetPoolDetail } from '@/hooks/useGetPoolDetail';

import PoolInfo from './PoolInfo';
import PoolPrizePot from './PoolPrizePot';
import PoolRound from './PoolRound';
import RoundAction from './RoundAction';

const PoolCountDown = dynamic(() => import('./PoolCountDown'), { ssr: false });

interface Props extends HTMLAttributes<HTMLDivElement> {
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
  poolId: number;
  isActive: boolean;
}

const PoolCard: FC<Props> = ({ poolId, isShow, setIsShow, className, isActive, ...props }) => {
  const [currentRound, setCurrentRound] = useState<number>(0);

  const { pool, rounds, poolPrizes, currency } = useGetPoolDetail({ poolId: poolId || 0, isActive });
  const roundActive = rounds[currentRound];
  const roundActiveNumber = roundActive
    ? `${roundActive.roundNumber < 10 ? `0${roundActive.roundNumber}` : roundActive.roundNumber}`
    : '00';

  const isEndRound = useMemo(() => {
    if (!rounds) return false;

    const roundEndtime = new Date(roundActive?.endTime);
    const now = new Date();

    if (now > roundEndtime) {
      return true;
    }

    return false;
  }, [roundActive?.endTime, rounds]);

  return (
    <div {...props} className={cn('w-full rounded-xl overflow-hidden relative', className)}>
      <div className="bg-navigate-tab py-1.5 h-[4.25rem]">
        <div className="text-primary text-2xl font-semibold text-center">{pool?.name}</div>

        <PoolCountDown date={roundActive?.endTime} />
      </div>

      <RoundAction
        minRound={MIN_ROUND}
        maxRound={rounds?.length || 0}
        currentRound={roundActiveNumber}
        setCurrentRound={setCurrentRound}
      />

      <div className="border-x-navigate-tab border-x">
        <PoolRound
          rounds={rounds}
          currentRound={roundActiveNumber}
          date={roundActive?.endTime}
          isEndRound={isEndRound}
        />

        <PoolPrizePot
          currentRound={roundActiveNumber}
          poolId={poolId || 0}
          roundId={roundActive?.id || 0}
          currency={currency}
          isEndRound={isEndRound}
          poolIdOnChain={pool?.poolIdOnChain || 0}
          winCode={roundActive?.winningCode || '    '}
        />
      </div>

      <PoolInfo
        isShow={isShow}
        setIsShow={setIsShow}
        poolPrizes={poolPrizes}
        currency={currency}
        isEndRound={isEndRound}
      />
    </div>
  );
};

export default PoolCard;
