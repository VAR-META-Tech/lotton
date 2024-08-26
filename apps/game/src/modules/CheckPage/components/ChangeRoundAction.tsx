import { Icons } from '@/assets/icons';

import { HStack } from '@/components/ui/Utilities';
import { RoundButton } from '@/modules/LandingPage/components/PoolList/PoolCard/RoundAction';

type Props = {
  // eslint-disable-next-line no-unused-vars
  onClick: (isUp: boolean) => void;
};
export const ChangeRoundAction = ({ onClick }: Props) => (
  <HStack spacing={16}>
    <RoundButton onClick={() => onClick(false)}>
      <Icons.arrowLeft />
    </RoundButton>

    <RoundButton onClick={() => onClick(true)}>
      <Icons.arrowRight />
    </RoundButton>
  </HStack>
);
