import { Icons } from '@/assets/icons';
import { cn } from '@/lib/utils';
import { FCC } from '@/types';
import React, { Dispatch, FC, HTMLAttributes, SetStateAction, useCallback } from 'react';

interface Props {
  minRound: number;
  maxRound: number;
  currentRound: number;
  setCurrentRound: Dispatch<SetStateAction<number>>;
}

const RoundAction: FC<Props> = ({ minRound, maxRound, currentRound, setCurrentRound }) => {
  const handleChangeRound = useCallback(
    (type: 'plus' | 'minus') => {
      const isPlus = type === 'plus';

      if ((isPlus && currentRound === maxRound) || (!isPlus && currentRound === minRound)) return;

      if (isPlus) {
        setCurrentRound((prev) => prev + 1);
        return;
      }

      setCurrentRound((prev) => prev - 1);
    },
    [currentRound, maxRound, minRound, setCurrentRound]
  );

  return (
    <div className="space-x-5 absolute top-24 right-5 z-20">
      <RoundButton isDisabled={currentRound === minRound} onClick={() => handleChangeRound('minus')}>
        <Icons.arrowLeft color="#fff" />
      </RoundButton>

      <RoundButton isDisabled={currentRound === maxRound} onClick={() => handleChangeRound('plus')}>
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
