import { Icons } from '@/assets/icons';

import { HStack } from '@/components/ui/Utilities';
import { useGetPoolDetail } from '@/hooks/useGetPoolDetail';
import { RoundButton } from '@/modules/LandingPage/components/PoolList/PoolCard/RoundAction';
import { MIN_ROUND } from '@/modules/LandingPage/utils/const';

type Props = {
  // eslint-disable-next-line no-unused-vars
  onClick: (isUp: boolean) => void;
  activeRound: number;
  poolId: number;
};

export const ChangeRoundAction = ({ onClick, activeRound, poolId }: Props) => {
  const { rounds } = useGetPoolDetail({ poolId, isActive: true });

  return (
    <HStack spacing={16}>
      <RoundButton onClick={() => onClick(false)} isDisabled={activeRound - MIN_ROUND < 0}>
        <Icons.arrowLeft />
      </RoundButton>

      <RoundButton onClick={() => onClick(true)} isDisabled={activeRound === rounds.length - 1}>
        <Icons.arrowRight />
      </RoundButton>
    </HStack>
  );
};
