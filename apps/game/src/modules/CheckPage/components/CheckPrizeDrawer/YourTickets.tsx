import { Icons } from '@/assets/icons';
import { VStack } from '@/components/ui/Utilities';
import { FC, useCallback } from 'react';
import TicketMatch from '../TicketMatch';
import SummaryTickets from '../SummaryTickets';
import { IGetPoolJoinedItemRound } from '@/apis/pools';

interface IYourTicketsProps {
  round: IGetPoolJoinedItemRound;
}

const YourTickets: FC<IYourTicketsProps> = ({ round }) => {
  const getMatch = useCallback(
    (code: string) => {
      for (let index = round?.winningCode?.length || 0; index >= 0; index--) {
        if (code.slice(0, index) === round?.winningCode?.slice(0, index)) return index;
      }

      return 0;
    },
    [round?.winningCode]
  );

  const renderYourTicketSummary = useCallback(() => {
    return (
      <VStack spacing={8}>
        <p className="font-bold">YOUR TICKET</p>

        <VStack spacing={16} justify={'center'}>
          <SummaryTickets
            title="Total tickets:"
            total={Number(round?.totalTicket || 0)}
            icon={<Icons.ticket width={25} height={20} className="text-primary" />}
          />

          <SummaryTickets
            title="Wining tickets:"
            total={Number(round?.ticket?.length || 0)}
            icon={<Icons.bookmark width={30} height={30} className="text-primary" />}
          />
        </VStack>
      </VStack>
    );

    // return <SummaryTickets title="YOUR TICKET:" total={10} icon={''} className="justify-start" />;
  }, [round?.ticket?.length, round?.totalTicket]);

  return (
    <VStack className="container p-4 py-8" spacing={40}>
      {renderYourTicketSummary()}

      <VStack spacing={32}>
        {round?.ticket?.map((item, index) => {
          return (
            <TicketMatch
              key={`${item?.id}-${index}`}
              code={item?.code}
              ticketNumber={2}
              matched={getMatch(item?.code)}
            />
          );
        })}
      </VStack>
    </VStack>
  );
};

export default YourTickets;
