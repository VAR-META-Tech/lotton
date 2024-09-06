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
}

const RoundAction: FC<Props> = ({ maxRound, roundActive, setCurrentRound }) => {
  const roundNumber = Number(getRoundActiveNumber(roundActive?.roundNumber) || 0);

  const handleChangeRound = useCallback(
    (type: 'plus' | 'minus') => {
      const isPlus = type === 'plus';

      if ((isPlus && roundNumber === maxRound) || (!isPlus && roundNumber === MIN_ROUND)) return;

      if (isPlus) {
        setCurrentRound((prev) => prev + 1);
        return;
      }

      setCurrentRound((prev) => prev - 1);
    },
    [maxRound, roundNumber, setCurrentRound]
  );

  return (
    <div className="space-x-5 absolute top-24 right-5 z-20">
      <RoundButton isDisabled={roundNumber === MIN_ROUND} onClick={() => handleChangeRound('minus')}>
        <Icons.arrowLeft color="#fff" />
      </RoundButton>

      <RoundButton isDisabled={roundNumber === maxRound} onClick={() => handleChangeRound('plus')}>
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
