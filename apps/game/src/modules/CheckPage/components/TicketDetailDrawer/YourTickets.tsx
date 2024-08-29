import { VStack } from '@/components/ui/Utilities';
import { FC, useCallback } from 'react';
import TicketMatch from '../TicketMatch';
import SummaryTickets from '../SummaryTickets';
import { IGetPoolJoinedItemRound } from '@/apis/pools';

interface IYourTicketsProps {
  winCode: string;
  roundInfo: IGetPoolJoinedItemRound | undefined;
}

const YourTickets: FC<IYourTicketsProps> = ({ winCode, roundInfo }) => {
  const getMatch = useCallback(
    (code: string) => {
      for (let index = winCode?.length; index >= 0; index--) {
        if (code?.slice(0, index) === winCode?.slice(0, index)) return index;
      }

      return 0;
    },
    [winCode]
  );

  return (
    <div className="border-t-gray-color border py-8">
      <VStack spacing={32}>
        <SummaryTickets
          title="YOUR TICKET:"
          total={Number(roundInfo?.totalTicket || 0)}
          icon={''}
          className="justify-start"
        />

        <VStack spacing={32}>
          {roundInfo?.ticket?.map((item, index) => {
            return (
              <TicketMatch
                key={`${item?.id}-${index}`}
                code={item?.code || ''}
                ticketNumber={item?.id || 0}
                matched={getMatch(item?.code || '')}
              />
            );
          })}
        </VStack>
      </VStack>
    </div>
  );
};

export default YourTickets;
