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
  roundIdOnChain: number;
  poolIdOnChain: number;
  isBeforeRoundEnd: boolean;
}

const PoolAction: FC<Props> = ({ holdingTicket, poolId, poolIdOnChain, roundIdOnChain, isBeforeRoundEnd }) => {
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

        <Button
          disabled={!isBeforeRoundEnd}
          onClick={() => setPoolId(poolId)}
          className="bg-gradient-to-r from-primary to-[#ED9BD6]"
        >
          Buy Tickets
        </Button>
      </VStack>
    );
  }, [holdingTicket, isBeforeRoundEnd, poolId, setPoolId]);

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

      <BuyTicketDrawer poolId={poolId || 0} roundIdOnChain={roundIdOnChain} poolIdOnChain={poolIdOnChain} />
    </div>
  );
};

export default PoolAction;
