'use client';

import React, { FC, HTMLAttributes, useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';

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

  const { pool, rounds, refetch } = useGetPoolDetail({ poolId: poolId || 0, isActive });
  const roundActive = rounds[currentRound];

  const getIsEndRound = () => {
    if (!rounds || !roundActive?.endTime) return false;

    const roundEndTime = new Date(Number(roundActive?.endTime) * 1000).getTime();
    const now = new Date().getTime();

    if (now > roundEndTime) {
      return true;
    }

    return false;
  };

  const getCurrentRound = useCallback(() => {
    const now = new Date().getTime();

    return rounds?.findIndex((round) => {
      const startTime = new Date(Number(round?.startTime) * 1000).getTime();
      const endTime = new Date(Number(round?.endTime) * 1000).getTime();
      return now >= startTime && now <= endTime;
    });
  }, [rounds]);

  const isBeforeRoundEnd = useMemo(() => {
    if (!rounds || rounds?.length === 0) return false;

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

  useEffect(() => {
    const refetchInterval = setInterval(() => {
      refetch();
    }, 10000);

    return () => clearInterval(refetchInterval);
  }, [refetch]);

  return (
    <div {...props} className={cn('w-full rounded-xl overflow-hidden relative', className)}>
      <div className="bg-navigate-tab py-1.5 h-[4.25rem]">
        <div className="text-primary text-2xl font-semibold text-center">{pool?.name}</div>

        <PoolCountDown
          date={Number(roundActive?.endTime || 0)}
          isBeforeRoundEnd={isBeforeRoundEnd}
          onForceUpdate={handleForceUpdate}
        />
      </div>

      <RoundAction roundActive={roundActive} maxRound={rounds?.length || 0} setCurrentRound={setCurrentRound} />

      <div className="border-x-navigate-tab border-x">
        <PoolRound rounds={rounds} roundActive={roundActive} isEndRound={getIsEndRound()} />

        <PoolPrizePot
          pool={pool}
          roundActive={roundActive}
          isEndRound={getIsEndRound()}
          isBeforeRoundEnd={isBeforeRoundEnd}
        />
      </div>

      <PoolInfo
        pool={pool}
        roundActive={roundActive}
        isShow={isShow}
        setIsShow={setIsShow}
        isEndRound={getIsEndRound()}
      />
    </div>
  );
};

export default PoolCard;
