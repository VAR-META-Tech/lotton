import React from 'react';
import TicketInfo from '../TicketInfo';
import WinningNumber from './WinningNumber';
import YourTickets from './YourTickets';
import { FCC } from '@/types';
import { IGetPoolJoinedItemRound } from '@/apis/pools';

interface Props {
  name: string;
  round: IGetPoolJoinedItemRound;
}

const CheckPrize: FCC<Props> = ({ name, round }) => {
  return (
    <div className="space-y-2">
      <div className="container">
        <TicketInfo name={name} roundActiveNumber={round?.roundNumber || 0} />

        <WinningNumber code={round?.winningCode || '    '} className="py-5" />
      </div>

      <div className="border-t-gray-color border">
        <YourTickets round={round} />
      </div>
    </div>
  );
};

export default CheckPrize;
