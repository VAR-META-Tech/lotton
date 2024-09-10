import { IGetPoolDetailRound } from '@/apis/pools';
import { Skeleton } from '@/components/ui/skeleton';
import { HStack, VStack } from '@/components/ui/Utilities';
import { cn } from '@/lib/utils';
import { useBuyTicketStore } from '@/stores/BuyTicketStore';
import React, { FC, HTMLAttributes, memo, useCallback, useEffect, useMemo, useState } from 'react';

interface Props {
  roundActive: IGetPoolDetailRound;
  isBeforeRoundEnd: boolean;
  onForceUpdate: () => void;
  isLoadingCountDown: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const getDefaultTimeLeft = (): TimeLeft => ({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});

const PoolCountDown: FC<Props> = ({ roundActive, isBeforeRoundEnd, onForceUpdate, isLoadingCountDown }) => {
  const endTime = useMemo(() => Number(roundActive?.endTime || 0), [roundActive?.endTime]);
  const setPoolId = useBuyTicketStore.use.setPoolId();

  const calculateTimeLeft = useCallback((): TimeLeft => {
    if (!endTime) return getDefaultTimeLeft();

    const targetDate = new Date(Number(endTime) * 1000).getTime();
    const now = Date.now();

    if (isNaN(targetDate)) return getDefaultTimeLeft();

    const difference = targetDate - now;

    if (difference <= 0) return getDefaultTimeLeft();

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, [endTime]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    if (!endTime || isNaN(new Date(Number(endTime) * 1000).getTime())) return;

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        clearInterval(timer);

        setTimeout(() => {
          onForceUpdate();
          setPoolId(undefined);
        }, 1000);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, calculateTimeLeft, onForceUpdate, setPoolId]);

  const isEnd = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  if (isLoadingCountDown) {
    return (
      <HStack pos="center" align="center" className="text-white font-medium flex-1">
        <Skeleton className="h-9 w-32 bg-gray-color" />
      </HStack>
    );
  }
  if (isEnd && !roundActive?.winningCode) {
    return (
      <HStack pos="center" align="center" className="text-white font-medium flex-1">
        Drawing
      </HStack>
    );
  }

  if (isEnd) {
    return (
      <HStack pos="center" align="center" className="text-white font-medium flex-1 ">
        Closed
      </HStack>
    );
  }

  if (!isBeforeRoundEnd)
    return (
      <HStack pos="center" align="center" className="text-white font-medium flex-1 ">
        Upcoming
      </HStack>
    );

  return (
    <div className="text-white text-center font-medium flex justify-center gap-3">
      <TimeItem value={timeLeft.days} description="day" />
      <TimeItem value={timeLeft.hours} description="hour" />
      <TimeItem value={timeLeft.minutes} description="min" />
      <TimeItem value={timeLeft.seconds} description="sec" />
      {/* <span>s until the draw</span> */}
    </div>
  );
};

export default memo(PoolCountDown);

interface ITimeItemProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  description: string;
  valueClassName?: ITimeItemProps['className'];
  descriptionClassName?: ITimeItemProps['className'];
}

const TimeItem: FC<ITimeItemProps> = ({
  value,
  description,
  valueClassName,
  descriptionClassName,
  className,
  ...props
}) => {
  return (
    <VStack spacing={0} className={cn(className)} {...props}>
      <span className={cn('text-lg leading-none', valueClassName)}>{String(value).padStart(2, '0')}</span>
      <span className={cn('text-xs leading-none', descriptionClassName)}>{description}</span>
    </VStack>
  );
};
