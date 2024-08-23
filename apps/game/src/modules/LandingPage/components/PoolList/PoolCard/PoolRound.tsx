import React, { Dispatch, FC, HTMLAttributes, memo, SetStateAction, useCallback } from 'react';
import { IGetPoolDetailRound } from '@/apis/pools';
import { Icons } from '@/assets/icons';
import { FCC } from '@/types';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { HStack } from '@/components/ui/Utilities';

interface Props {
  rounds: IGetPoolDetailRound[];
  minRound: number;
  maxRound: number;
  currentRound: number;
  setCurrentRound: Dispatch<SetStateAction<number>>;
  date: string | undefined;
}

const PoolRound: FC<Props> = ({ minRound, maxRound, currentRound, setCurrentRound, date }) => {
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
    <div className="border-x-navigate-tab border-x text-white px-5 py-4">
      <HStack pos={'apart'} spacing={12}>
        <div className="space-y-2">
          <div>
            <span className="font-medium">Round</span>{' '}
            <span className="bg-navigate-tab px-3 py-1 rounded-lg">{`${currentRound >= 10 ? currentRound : `0${currentRound}`}`}</span>
          </div>

          <div className="text-xs">{!!date && `Draw ${format(new Date(date), 'MMM dd, yyyy, HH:mm a')}`}</div>
        </div>

        <div className="space-x-5">
          <RoundButton isDisabled={currentRound === minRound} onClick={() => handleChangeRound('minus')}>
            <Icons.arrowLeft color="#fff" />
          </RoundButton>

          <RoundButton isDisabled={currentRound === maxRound} onClick={() => handleChangeRound('plus')}>
            <Icons.arrowRight color="#fff" />
          </RoundButton>
        </div>
      </HStack>
    </div>
  );
};

export default memo(PoolRound);

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
