import React, { FC, memo, useCallback, useEffect, useState } from 'react';

interface Props {
  date?: string;
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

    const targetDate = new Date(date).getTime();
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

  return (
    <div className="text-white text-center font-medium">
      <span className="text-primary">{String(timeLeft.days).padStart(2, '0')}</span>
      <span>d</span> <span className="text-primary">{String(timeLeft.hours).padStart(2, '0')}</span>
      <span>h</span> <span className="text-primary">{String(timeLeft.minutes).padStart(2, '0')}</span>
      <span>m</span> <span className="text-primary">{String(timeLeft.seconds).padStart(2, '0')}</span>
      <span>s until the draw</span>
    </div>
  );
};

export default memo(PoolCountDown);
