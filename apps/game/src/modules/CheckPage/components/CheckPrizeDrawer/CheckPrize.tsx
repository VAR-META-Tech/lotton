import React from 'react';
import TicketInfo from '../TicketInfo';
import WinningNumber from './WinningNumber';
import YourTickets from './YourTickets';
import { FCC } from '@/types';

interface Props {
  name: string;
  round: number;
  winCode: string;
  isOnlyOneTicket?: boolean;
}

const CheckPrize: FCC<Props> = ({ name, round, winCode, isOnlyOneTicket = true }) => {
  return (
    <div className="space-y-2">
      <div className="container">
        {!!isOnlyOneTicket && <TicketInfo name={name} roundActiveNumber={round} />}

        <WinningNumber code={winCode} />
      </div>

      <div className="border-t-gray-color border">
        <YourTickets winCode={winCode} isOnlyOneTicket={isOnlyOneTicket} />
      </div>
    </div>
  );
};

export default CheckPrize;
