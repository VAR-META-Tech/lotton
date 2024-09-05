'use client';

import React, { FC, HTMLAttributes, useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { MIN_ROUND } from '@/modules/LandingPage/utils/const';

import { cn } from '@/lib/utils';
import { useGetPoolDetail } from '@/hooks/useGetPoolDetail';

import PoolInfo from './PoolInfo';
import PoolPrizePot from './PoolPrizePot';
import PoolRound from './PoolRound';
import RoundAction from './RoundAction';
import { useForceUpdate } from '@mantine/hooks';

const PoolCountDown = dynamic(() => import('./PoolCountDown'), { ssr: false });

interface Props extends HTMLAttributes<HTMLDivElement> {
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
  poolId: number;
  isActive: boolean;
}

const PoolCard: FC<Props> = ({ poolId, isShow, setIsShow, className, isActive, ...props }) => {
  const forceUpdate = useForceUpdate();

  const [currentRound, setCurrentRound] = useState<number>(0);

  const { pool, rounds, poolPrizes, currency } = useGetPoolDetail({ poolId: poolId || 0, isActive });
  const roundActive = rounds[currentRound];
  const roundActiveNumber = roundActive
    ? `${roundActive.roundNumber < 10 ? `0${roundActive.roundNumber}` : roundActive.roundNumber}`
    : '00';

  const getIsEndRound = () => {
    if (!rounds) return false;

    const roundEndtime = new Date(Number(roundActive?.endTime) * 1000).getTime();
    const now = new Date().getTime();

    if (now > roundEndtime) {
      return true;
    }

    return false;
  };

  const getCurrentRound = useCallback(() => {
    const now = new Date().getTime();

    return rounds.findIndex((round) => {
      const startTime = new Date(Number(round.startTime) * 1000).getTime();
      const endTime = new Date(Number(round.endTime) * 1000).getTime();
      return now >= startTime && now <= endTime;
    });
  }, [rounds]);

  const isBeforeRoundEnd = useMemo(() => {
    if (!rounds || rounds.length === 0) return false;

    const currentActiveRound = getCurrentRound();

    return currentRound === currentActiveRound;
  }, [currentRound, getCurrentRound, rounds]);

  useEffect(() => {
    const currentActiveRound = getCurrentRound();

    setCurrentRound(currentActiveRound);
  }, [getCurrentRound]);

  const handleForceUpdate = useCallback(() => {
    forceUpdate();
  }, [forceUpdate]);

  return (
    <div {...props} className={cn('w-full rounded-xl overflow-hidden relative', className)}>
      <div className="bg-navigate-tab py-1.5 h-[4.25rem]">
        <div className="text-primary text-2xl font-semibold text-center">{pool?.name}</div>

        <PoolCountDown date={Number(roundActive?.endTime || 0)} onForceUpdate={handleForceUpdate} />
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
          date={Number(roundActive?.endTime || 0)}
          isEndRound={getIsEndRound()}
        />

        <PoolPrizePot
          currentRound={roundActiveNumber}
          poolId={poolId || 0}
          currency={currency}
          isEndRound={getIsEndRound()}
          poolIdOnChain={pool?.poolIdOnChain || 0}
          roundIdOnChain={roundActive?.roundIdOnChain}
          isBeforeRoundEnd={isBeforeRoundEnd}
          winCode={roundActive?.winningCode || '    '}
        />
      </div>

      <PoolInfo
        isShow={isShow}
        setIsShow={setIsShow}
        poolPrizes={poolPrizes}
        currency={currency}
        isEndRound={getIsEndRound()}
      />
    </div>
  );
};

export default PoolCard;
