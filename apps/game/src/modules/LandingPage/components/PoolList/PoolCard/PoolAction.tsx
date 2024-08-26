import React, { FC, useCallback, useMemo } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { VStack } from '@/components/ui/Utilities';

import { ConnectWallet } from '../../ConnectWallet';
import BuyTicketDrawer from '../BuyTicketDrawer';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

interface Props {
  holdingTicket: number;
  ticketPrice: number;
}

const PoolAction: FC<Props> = ({ holdingTicket, ticketPrice }) => {
  const { isLoggedIn, status } = useAuth();

  const renderBuyTicketsButton = useCallback(() => {
    return (
      <BuyTicketDrawer ticketPrice={ticketPrice}>
        <VStack align={'center'}>
          <span className="text-center text-white text-xs">
            You have{' '}
            <Link href={ROUTES.CHECK} className="underline">
              <span className="text-sm font-bold">{holdingTicket}</span>{' '}
              <span className="text-xs">{holdingTicket > 1 ? 'tickets' : 'ticket'}</span>
            </Link>{' '}
            this round
          </span>

          <Button className="bg-gradient-to-r from-primary to-[#ED9BD6]">Buy Tickets</Button>
        </VStack>
      </BuyTicketDrawer>
    );
  }, [holdingTicket, ticketPrice]);

  const renderComponent = useMemo(() => {
    if (status === 'waiting') return <Spinner className="w-8 h-8 text-white" />;

    if (isLoggedIn) {
      return renderBuyTicketsButton();
    }

    return <ConnectWallet />;
  }, [isLoggedIn, renderBuyTicketsButton, status]);

  return <div>{renderComponent}</div>;
};

export default PoolAction;
