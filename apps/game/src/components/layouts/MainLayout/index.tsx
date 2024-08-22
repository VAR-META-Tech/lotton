'use client';

import React, { useEffect } from 'react';
import { useLoginByWalletMutation } from '@/apis/auth';
import { FCC } from '@/types';
import { useTonWallet } from '@tonconnect/ui-react';

import { onMutateError } from '@/lib/common';
import { useAuth } from '@/hooks/useAuth';
import { VStack } from '@/components/ui/Utilities';

import NavigateTab from './components/NavigateTab';

const MainLayout: FCC = ({ children }) => {
  const wallet = useTonWallet();
  const { setUserData, status } = useAuth();

  const { mutate: loginByWallet } = useLoginByWalletMutation({
    onSuccess: (data) => {
      setUserData({
        accessToken: data?.data?.tokens?.accessToken,
        refreshToken: data?.data?.tokens?.refreshToken,
        user: data?.data?.user,
      });
    },
    onError: onMutateError,
  });

  useEffect(() => {
    if (!wallet || status === 'waiting') return;

    loginByWallet({
      wallet: wallet?.account?.address,
    });
  }, [loginByWallet, status, wallet]);

  return (
    <VStack className="relative flex flex-col lg:hidden">
      <main className="bg-background mx-auto min-h-screen w-full grow text-clip">{children}</main>

      <NavigateTab />
    </VStack>
  );
};

export default MainLayout;
