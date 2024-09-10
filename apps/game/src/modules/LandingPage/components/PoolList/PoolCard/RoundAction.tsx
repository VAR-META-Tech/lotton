import { IGetPoolDetailRound } from '@/apis/pools';
import { Icons } from '@/assets/icons';
import { getRoundActiveNumber } from '@/lib/common';
import { cn } from '@/lib/utils';
import { MIN_ROUND } from '@/modules/LandingPage/utils/const';
import { FCC } from '@/types';
import React, { Dispatch, FC, HTMLAttributes, SetStateAction, useCallback } from 'react';

interface Props {
  maxRound: number;
  roundActive: IGetPoolDetailRound;
  setCurrentRound: Dispatch<SetStateAction<number>>;
  setIsLoadingCountDown: Dispatch<SetStateAction<boolean>>;
}

const RoundAction: FC<Props> = ({ maxRound, roundActive, setCurrentRound, setIsLoadingCountDown }) => {
  const roundNumber = Number(getRoundActiveNumber(roundActive?.roundNumber) || 0);

  const handleChangeRound = useCallback(
    (isPlus: boolean) => {
      setIsLoadingCountDown(true);
      const isMaxRound = maxRound === roundNumber;
      const isMinRound = roundNumber === MIN_ROUND;

      if ((isPlus && isMaxRound) || (!isPlus && isMinRound)) return;

      if (isPlus) {
        setCurrentRound((prev) => prev + 1);
      } else {
        setCurrentRound((prev) => prev - 1);
      }
    },
    [maxRound, roundNumber, setCurrentRound, setIsLoadingCountDown]
  );

  return (
    <div className="space-x-5 absolute top-[7.5rem] right-5 z-20">
      <RoundButton isDisabled={roundNumber === MIN_ROUND} onClick={() => handleChangeRound(false)}>
        <Icons.arrowLeft color="#fff" />
      </RoundButton>

      <RoundButton isDisabled={roundNumber === maxRound} onClick={() => handleChangeRound(true)}>
        <Icons.arrowRight color="#fff" />
      </RoundButton>
    </div>
  );
};

export default RoundAction;

interface IRoundButtonProps extends HTMLAttributes<HTMLButtonElement> {
  isDisabled?: boolean;
}

export const RoundButton: FCC<IRoundButtonProps> = ({ children, isDisabled, ...props }) => {
  return (
    <button
      disabled={isDisabled}
      className={cn('active:opacity-40', {
        'opacity-30': isDisabled,
      })}
      {...props}
    >
      {children}
    </button>
  );
};
