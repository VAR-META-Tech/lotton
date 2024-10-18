import React, { FC, useMemo } from 'react';
import TicketInfo from '../TicketInfo';
import YourTickets from './YourTickets';
import { HStack } from '@/components/ui/Utilities';
import { Button } from '@/components/ui/button';
import { IGetPoolJoinedItem, IGetPoolJoinedItemRound } from '@/apis/pools';
import { useBuyTicketStore } from '@/stores/BuyTicketStore';

interface Props {
  pool: IGetPoolJoinedItem;
  roundActive: IGetPoolJoinedItemRound;
}

const TicketDetailItem: FC<Props> = ({ pool, roundActive }) => {
  const setPoolId = useBuyTicketStore.use.setPoolId();

  const isEndRound = useMemo(() => {
    if (!roundActive?.endTime) return false;

    const roundEndTime = new Date(Number(roundActive?.endTime) * 1000);
    const now = new Date();

    if (now > roundEndTime) {
      return true;
    }

    return false;
  }, [roundActive?.endTime]);

  return (
    <div className="container">
      <TicketInfo name={pool?.name || ''} roundActiveNumber={roundActive?.roundNumber || 0} />

      <YourTickets roundActiveInfo={roundActive} />

      {!isEndRound && (
        <HStack pos={'center'}>
          <Button className="text-white" onClick={() => setPoolId(pool?.id)}>
            Buy More Ticket
          </Button>
        </HStack>
      )}
    </div>
  );
};

export default TicketDetailItem;
