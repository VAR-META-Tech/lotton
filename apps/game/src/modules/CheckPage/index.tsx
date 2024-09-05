'use client';

import { useAuth } from '@/hooks/useAuth';
import ConnectWalletSection from '../WalletPage/components/ConnectWalletSection';
import dynamic from 'next/dynamic';
import { VStack } from '@/components/ui/Utilities';
import { Spinner } from '@/components/ui/spinner';

const CheckWinner = dynamic(() => import('./components/CheckWinner'));
const PoolList = dynamic(() => import('./components/PoolList'));

export const CheckPage = () => {
  const { isLoggedIn, status } = useAuth();

  if (status !== 'ready')
    return (
      <VStack className="min-h-screen" align={'center'} justify={'center'}>
        <Spinner size="2rem" />
      </VStack>
    );

  if (!isLoggedIn) return <ConnectWalletSection />;

  return (
    <div className="container py-10 pb-24 space-y-16">
      <CheckWinner />

      <PoolList />
    </div>
  );
};
