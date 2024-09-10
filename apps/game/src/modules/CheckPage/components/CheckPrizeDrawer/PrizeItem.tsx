import { HStack, VStack } from '@/components/ui/Utilities';
import React, { FC, useMemo } from 'react';
import CheckPrize from './CheckPrize';
import { Button } from '@/components/ui/button';
import { IGetPoolJoinedItem, IGetPoolJoinedItemRound } from '@/apis/pools';
import { USER_TICKET_STATUS } from '../../utils/const';

interface Props {
  handleChangeStep: () => void;
  pool: IGetPoolJoinedItem;
  round: IGetPoolJoinedItemRound;
}

const PrizeItem: FC<Props> = ({ handleChangeStep, pool, round }) => {
  const isClaimed = useMemo(() => {
    return round?.ticket?.every((ticket) => ticket.status !== USER_TICKET_STATUS.BOUGHT);
  }, [round?.ticket]);

  return (
    <VStack>
      <CheckPrize name={pool?.name} round={round} />

      {!isClaimed && (
        <HStack pos={'center'}>
          <Button
            onClick={() => handleChangeStep()}
            size={'lg'}
            className="rounded-lg w-fit bg-gradient-to-r from-primary to-[#ED9BD6] text-white"
          >
            Collect Prizes
          </Button>
        </HStack>
      )}
    </VStack>
  );
};

export default PrizeItem;
