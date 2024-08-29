'use client';

import React, { useEffect } from 'react';
import { useLoginByWalletMutation } from '@/apis/auth';
import { FCC } from '@/types';
import { useTonWallet } from '@tonconnect/ui-react';

import { useAuth } from '@/hooks/useAuth';
import { VStack } from '@/components/ui/Utilities';

import NavigateTab from './components/NavigateTab';
import { toast } from 'sonner';

const MainLayout: FCC = ({ children }) => {
  const wallet = useTonWallet();
  const { setUserData, status, isLoggedIn } = useAuth();

  const { mutate: loginByWallet } = useLoginByWalletMutation({
    onSuccess: (data) => {
      toast.success('Connect wallet successful');
      setUserData({
        accessToken: data?.tokens?.accessToken,
        refreshToken: data?.tokens?.refreshToken,
        user: data?.user,
      });
    },
    onError: () => {
      toast.error('Connect wallet failed');
    },
  });

  useEffect(() => {
    if (!wallet || status === 'waiting' || !!isLoggedIn) return;

    loginByWallet({
      wallet: wallet?.account?.address,
    });
  }, [isLoggedIn, loginByWallet, status, wallet]);

  return (
    <VStack className="relative flex flex-col lg:hidden">
      <main className="bg-background mx-auto min-h-screen w-full grow text-clip">{children}</main>

      <NavigateTab />
    </VStack>
  );
};

export default MainLayout;
