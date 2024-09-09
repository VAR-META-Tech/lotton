import { Spinner } from '@/components/ui/spinner';
import { HStack, VStack } from '@/components/ui/Utilities';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/routes';
import Link from 'next/link';
import React, { FC, useMemo } from 'react';
import { ConnectWallet } from '../../ConnectWallet';

interface Props {
  holdingTicket: number;
}

const UserTicketCount: FC<Props> = ({ holdingTicket }) => {
  const { isLoggedIn, status } = useAuth();

  const renderComponent = useMemo(() => {
    if (status === 'waiting') return <Spinner className="w-8 h-8 text-white" />;

    if (isLoggedIn) {
      return (
        <VStack className="text-xs" align="center" spacing={0}>
          <span className="text-center">
            You have <span className="text-sm">{holdingTicket}</span> ticket this round{' '}
          </span>
          <Link href={ROUTES.CHECK} className="text-sm font-bold text-primary text-center">
            View your tickets
          </Link>
        </VStack>
      );
    }

    return (
      <HStack pos={'center'}>
        <ConnectWallet />
      </HStack>
    );
  }, [holdingTicket, isLoggedIn, status]);

  return <div>{renderComponent}</div>;
};

export default UserTicketCount;
