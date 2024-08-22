import React, { FC, useMemo } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { VStack } from '@/components/ui/Utilities';

import { ConnectWallet } from '../../ConnectWallet';
import BuyTicketDrawer from '../BuyTicketDrawer';

interface Props {
  ticketCount: number;
}

const PoolAction: FC<Props> = ({ ticketCount }) => {
  const { isLoggedIn, status } = useAuth();

  const renderComponent = useMemo(() => {
    if (status === 'waiting') return <Spinner className="w-8 h-8 text-white" />;

    if (isLoggedIn) {
      return (
        <BuyTicketDrawer>
          <VStack align={'center'}>
            <span className="text-center text-white text-xs">
              You have{' '}
              <span className="underline">
                <span className="text-sm font-bold">{ticketCount}</span>{' '}
                <span className="text-xs">{ticketCount > 1 ? 'tickets' : 'ticket'}</span>
              </span>{' '}
              this round
            </span>

            <Button className="bg-gradient-to-r from-primary to-[#ED9BD6]">Buy Tickets</Button>
          </VStack>
        </BuyTicketDrawer>
      );
    }

    return <ConnectWallet />;
  }, [isLoggedIn, status, ticketCount]);

  return <div>{renderComponent}</div>;
};

export default PoolAction;
