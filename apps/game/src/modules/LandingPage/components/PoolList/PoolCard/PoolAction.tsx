import React, { FC, useCallback, useMemo } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { VStack } from '@/components/ui/Utilities';

import { ConnectWallet } from '../../ConnectWallet';
import BuyTicketDrawer from '../BuyTicketDrawer';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { useBuyTicketStore } from '@/stores/BuyTicketStore';

interface Props {
  holdingTicket: number;
  poolId: number;
  roundId: number;
}

const PoolAction: FC<Props> = ({ holdingTicket, poolId, roundId }) => {
  const { isLoggedIn, status } = useAuth();
  const setPoolId = useBuyTicketStore.use.setPoolId();

  const renderBuyTicketsButton = useCallback(() => {
    return (
      <VStack align={'center'}>
        <span className="text-center text-white text-xs">
          You have{' '}
          <Link href={ROUTES.CHECK} className="underline">
            <span className="text-sm font-bold">{holdingTicket}</span>{' '}
            <span className="text-xs">{holdingTicket > 1 ? 'tickets' : 'ticket'}</span>
          </Link>{' '}
          this round
        </span>

        <Button onClick={() => setPoolId(poolId)} className="bg-gradient-to-r from-primary to-[#ED9BD6]">
          Buy Tickets
        </Button>
      </VStack>
    );
  }, [holdingTicket, poolId, setPoolId]);

  const renderComponent = useMemo(() => {
    if (status === 'waiting') return <Spinner className="w-8 h-8 text-white" />;

    if (isLoggedIn) {
      return renderBuyTicketsButton();
    }

    return <ConnectWallet />;
  }, [isLoggedIn, renderBuyTicketsButton, status]);

  return (
    <div>
      {renderComponent}

      <BuyTicketDrawer poolId={poolId || 0} roundId={roundId} />
    </div>
  );
};

export default PoolAction;
