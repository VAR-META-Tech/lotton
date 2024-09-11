'use client';

import { useAuth } from '@/hooks/useAuth';
import ConnectWalletSection from '../WalletPage/components/ConnectWalletSection';
import dynamic from 'next/dynamic';
import { VStack } from '@/components/ui/Utilities';
import { Spinner } from '@/components/ui/spinner';
import { useInfinityPoolJoined } from '@/hooks/useInfinityPoolJoined';
import Empty from '@/components/Empty';

const CheckWinner = dynamic(() => import('./components/CheckWinner'));
const PoolList = dynamic(() => import('./components/PoolList'));

export const CheckPage = () => {
  const { isLoggedIn, status } = useAuth();
  const { poolList, isLoading } = useInfinityPoolJoined();

  if (status !== 'ready' || isLoading)
    return (
      <VStack className="min-h-screen" align={'center'} justify={'center'}>
        <Spinner size="2rem" />
      </VStack>
    );

  if (!isLoggedIn) return <ConnectWalletSection />;

  if (!poolList?.length) {
    return (
      <VStack justify="center" align="center" className="min-h-screen">
        <Empty
          emptyText={`It's never too late to start playing! Let's grab some tickets and hope for a lucky streak.`}
          textClassName="text-center max-w-96"
        />
      </VStack>
    );
  }

  return (
    <div className="container py-10 pb-24 space-y-16">
      <CheckWinner />

      <PoolList />
    </div>
  );
};
