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
import { IGetPoolDetailData, IGetPoolDetailRound } from '@/apis/pools';

interface Props {
  pool: IGetPoolDetailData | undefined;
  roundActive: IGetPoolDetailRound;
  holdingTicket: number;
  isBeforeRoundEnd: boolean;
}

const PoolAction: FC<Props> = ({ pool, holdingTicket, roundActive, isBeforeRoundEnd }) => {
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
          onClick={() => setPoolId(pool?.id || 0)}
          className="bg-gradient-to-r from-primary to-[#ED9BD6]"
        >
          Buy Tickets
        </Button>
      </VStack>
    );
  }, [holdingTicket, isBeforeRoundEnd, pool?.id, setPoolId]);

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

      <BuyTicketDrawer pool={pool} roundActive={roundActive} />
    </div>
  );
};

export default PoolAction;
