'use client';

import { useAuth } from '@/hooks/useAuth';
import ConnectWalletSection from '../WalletPage/components/ConnectWalletSection';
import { CheckWinner } from './components/CheckWinner';
import { PoolList } from './components/PoolList';

export const CheckPage = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) return <ConnectWalletSection />;

  return (
    <div className="container py-10 pb-24 space-y-16">
      <CheckWinner />

      <div>
        <PoolList />
      </div>
    </div>
  );
};
