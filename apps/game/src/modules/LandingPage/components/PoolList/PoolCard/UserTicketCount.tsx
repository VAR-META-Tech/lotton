import { Spinner } from '@/components/ui/spinner';
import { HStack, VStack } from '@/components/ui/Utilities';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/routes';
import React, { FC, useCallback, useMemo } from 'react';
import { ConnectWallet } from '../../ConnectWallet';
import { useDetailTicketStore } from '@/stores/DetailTicketStore';
import { useRouter } from 'next/navigation';

interface Props {
  holdingTicket: number;
  poolId: number;
  roundId: number;
}

const UserTicketCount: FC<Props> = ({ holdingTicket, poolId, roundId }) => {
  const router = useRouter();
  const { isLoggedIn, status } = useAuth();
  const setPoolId = useDetailTicketStore.use.setPoolId();
  const setRoundId = useDetailTicketStore.use.setRoundId();

  const handleNavigate = useCallback(() => {
    router.push(ROUTES.CHECK);
    setPoolId(poolId);
    setRoundId(roundId);
  }, [poolId, roundId, router, setPoolId, setRoundId]);

  const renderComponent = useMemo(() => {
    if (status === 'waiting') return <Spinner className="w-8 h-8 text-white" />;

    if (isLoggedIn) {
      return (
        <VStack className="text-xs h-10" align="center" spacing={0}>
          <span className="text-center">
            You have <span className="text-sm">{holdingTicket}</span> ticket this round{' '}
          </span>
          {!!holdingTicket && (
            <button onClick={handleNavigate} className="text-sm font-bold text-primary text-center">
              View your tickets
            </button>
          )}
        </VStack>
      );
    }

    return (
      <HStack pos={'center'}>
        <ConnectWallet />
      </HStack>
    );
  }, [handleNavigate, holdingTicket, isLoggedIn, status]);

  return <div>{renderComponent}</div>;
};

export default UserTicketCount;
