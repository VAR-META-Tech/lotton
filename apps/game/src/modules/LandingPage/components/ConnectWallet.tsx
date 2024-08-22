'use client';

import React from 'react';
import { useTonConnectModal } from '@tonconnect/ui-react';

import { Button } from '@/components/ui/button';

export const ConnectWallet = () => {
  const { open } = useTonConnectModal();

  return (
    <Button onClick={() => open()} className="rounded-lg">
      Connect Wallet
    </Button>
  );
};
