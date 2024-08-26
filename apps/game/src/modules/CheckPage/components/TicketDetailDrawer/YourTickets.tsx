import { VStack } from '@/components/ui/Utilities';
import { FC, useCallback } from 'react';
import TicketMatch from '../TicketMatch';
import SummaryTickets from '../SummaryTickets';

interface IYourTicketsProps {
  winCode: string;
}

const YourTickets: FC<IYourTicketsProps> = ({ winCode }) => {
  const getMatch = useCallback(
    (code: string) => {
      for (let index = winCode.length; index >= 0; index--) {
        if (code.slice(0, index) === winCode.slice(0, index)) return index;
      }

      return 0;
    },
    [winCode]
  );

  return (
    <div className="border-t-gray-color border py-8">
      <VStack spacing={32}>
        <SummaryTickets title="YOUR TICKET:" total={10} icon={''} className="justify-start" />

        <VStack spacing={32}>
          <TicketMatch code="5abc" ticketNumber={1} matched={getMatch('5abc')} />
          <TicketMatch code="31cd" ticketNumber={2} matched={getMatch('31cd')} />
          <TicketMatch code="a7c2" ticketNumber={3} matched={getMatch('a7c2')} />
          <TicketMatch code="612d" ticketNumber={4} matched={getMatch('612d')} />
          <TicketMatch code="3fgk" ticketNumber={5} matched={getMatch('3fgk')} />
        </VStack>
      </VStack>
    </div>
  );
};

export default YourTickets;
