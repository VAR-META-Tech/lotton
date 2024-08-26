import { Icons } from '@/assets/icons';
import { VStack } from '@/components/ui/Utilities';
import { FC, useCallback } from 'react';
import TicketMatch from '../TicketMatch';
import SummaryTickets from '../SummaryTickets';

interface IYourTicketsProps {
  winCode: string;
  isOnlyOneTicket?: boolean;
}

const YourTickets: FC<IYourTicketsProps> = ({ winCode, isOnlyOneTicket }) => {
  const getMatch = useCallback(
    (code: string) => {
      for (let index = winCode.length; index >= 0; index--) {
        if (code.slice(0, index) === winCode.slice(0, index)) return index;
      }

      return 0;
    },
    [winCode]
  );

  const renderYourTicketSummary = useCallback(() => {
    if (isOnlyOneTicket)
      return (
        <VStack spacing={8}>
          <p className="font-bold">YOUR TICKET</p>

          <VStack spacing={16} justify={'center'}>
            <SummaryTickets
              title="Total tickets:"
              total={10}
              icon={<Icons.ticket width={25} height={20} className="text-primary" />}
            />
            <SummaryTickets
              title="Wining tickets:"
              total={10}
              icon={<Icons.bookmark width={30} height={30} className="text-primary" />}
            />
          </VStack>
        </VStack>
      );

    return <SummaryTickets title="YOUR TICKET:" total={10} icon={''} className="justify-start" />;
  }, [isOnlyOneTicket]);

  return (
    <VStack className="container p-4 py-8" spacing={32}>
      {renderYourTicketSummary()}

      <VStack spacing={32}>
        <TicketMatch code="1234" ticketNumber={2} matched={getMatch('1234')} />
        <TicketMatch code="1233" ticketNumber={4} matched={getMatch('1233')} />
        <TicketMatch code="1212" ticketNumber={5} matched={getMatch('1212')} />
        <TicketMatch code="1313" ticketNumber={6} matched={getMatch('1313')} />
      </VStack>
    </VStack>
  );
};

export default YourTickets;
