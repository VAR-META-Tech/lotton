'use client';

import React, { useMemo } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/spinner';
import { VStack } from '@/components/ui/Utilities';

import ConnectWalletSection from './components/ConnectWalletSection';
import YourWalletSection from './components/YourWalletSection';

const WalletPage = () => {
  const { isLoggedIn, status } = useAuth();

  const renderPage = useMemo(() => {
    if (status === 'waiting')
      return (
        <VStack justify={'center'} align={'center'} className="min-h-screen">
          <Spinner className="w-8 h-8 text-white" />
        </VStack>
      );

    if (!isLoggedIn) return <ConnectWalletSection />;

    return <YourWalletSection />;
  }, [isLoggedIn, status]);

  return <>{renderPage}</>;
};

export default WalletPage;
