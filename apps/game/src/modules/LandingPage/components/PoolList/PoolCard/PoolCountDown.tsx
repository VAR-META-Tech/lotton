import React, { FC, memo, useCallback, useEffect, useState } from 'react';

interface Props {
  date: number;
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

const PoolCountDown: FC<Props> = ({ date }) => {
  const calculateTimeLeft = useCallback((): TimeLeft => {
    if (!date) return getDefaultTimeLeft();

    const targetDate = new Date(date * 1000).getTime();
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
  }, [date]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    if (!date || isNaN(new Date(date).getTime())) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [date, calculateTimeLeft]);

  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) return <></>;

  return (
    <div className="text-white text-center font-medium">
      <TimeItem value={timeLeft.days} />
      <span>d</span> <TimeItem value={timeLeft.hours} />
      <span>h</span> <TimeItem value={timeLeft.minutes} />
      <span>m</span> <TimeItem value={timeLeft.seconds} />
      <span>s until the draw</span>
    </div>
  );
};

export default memo(PoolCountDown);

const TimeItem = ({ value }: { value: number }) => {
  return <span className="text-primary h-6">{String(value).padStart(2, '0')}</span>;
};
