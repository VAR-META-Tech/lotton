import { IGetPoolJoinedItemRound } from '@/apis/pools';
import { Icons } from '@/assets/icons';

import { HStack } from '@/components/ui/Utilities';
import { RoundButton } from '@/modules/LandingPage/components/PoolList/PoolCard/RoundAction';
import { MIN_ROUND } from '@/modules/LandingPage/utils/const';
import { memo } from 'react';

type Props = {
  // eslint-disable-next-line no-unused-vars
  onClick: (isUp: boolean) => void;
  activeRound: number;
  rounds: IGetPoolJoinedItemRound[];
};

export const ChangeRoundAction = memo(({ onClick, activeRound, rounds }: Props) => {
  return (
    <HStack spacing={16}>
      <RoundButton onClick={() => onClick(false)} isDisabled={activeRound - MIN_ROUND < 0}>
        <Icons.arrowLeft />
      </RoundButton>

      <RoundButton onClick={() => onClick(true)} isDisabled={activeRound === rounds?.length - 1}>
        <Icons.arrowRight />
      </RoundButton>
    </HStack>
  );
});
