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
import { VStack } from '@/components/ui/Utilities';

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
  const [isLoadingCountDown, setIsLoadingCountDown] = useState<boolean>(false);

  const { pool, rounds } = useGetPoolDetail({ poolId: poolId || undefined, isActive });
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
    if (currentActiveRound > -1) setCurrentRound(currentActiveRound);
  }, [getCurrentRound]);

  const handleForceUpdate = useCallback(() => {
    forceUpdate();
  }, [forceUpdate]);

  useEffect(() => {
    if (!isLoadingCountDown) return;

    const timer = setTimeout(() => {
      setIsLoadingCountDown(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isLoadingCountDown]);

  return (
    <div {...props} className={cn('w-full rounded-xl overflow-hidden relative', className)}>
      <VStack spacing={8} className="bg-navigate-tab py-1.5 h-[5.5rem]">
        <div className="text-primary text-2xl font-semibold text-center">{pool?.name}</div>

        <PoolCountDown
          roundActive={roundActive}
          isBeforeRoundEnd={isBeforeRoundEnd}
          onForceUpdate={handleForceUpdate}
          isLoadingCountDown={isLoadingCountDown}
        />
      </VStack>

      <RoundAction
        roundActive={roundActive}
        maxRound={rounds?.length || 0}
        setCurrentRound={setCurrentRound}
        setIsLoadingCountDown={setIsLoadingCountDown}
      />

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
