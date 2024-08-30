'use client';

import React, { useMemo } from 'react';
import { Icons } from '@/assets/icons';
import { useTonConnectUI } from '@tonconnect/ui-react';

import { prettyNumber, shortenAddress } from '@/lib/common';
import { useAuth } from '@/hooks/useAuth';
import { useCopy } from '@/hooks/useCopy';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VStack } from '@/components/ui/Utilities';

import BalanceItem from './BalanceItem';
import { useWallet } from '@/hooks/useWallet';

const WalletTab = () => {
  const [copied, copy] = useCopy();
  const { user } = useAuth();
  const [tonConnectUI] = useTonConnectUI();
  const { logout } = useAuth();
  const { balance } = useWallet();
  const handleDisconnectWallet = async () => {
    logout();
    await tonConnectUI.disconnect();
  };

  const renderCopyComponent = useMemo(() => {
    if (copied) {
      return <Icons.check className="text-gray-color" />;
    }

    return <Icons.copy className="text-gray-color" onClick={() => copy(user?.wallet || '')} />;
  }, [copied, copy, user?.wallet]);

  return (
    <VStack spacing={40} className="text-white">
      <VStack>
        <span className="text-base font-bold">Your wallet address</span>

        <Input
          value={shortenAddress(user?.wallet || '', 16)}
          suffix={renderCopyComponent}
          className="text-white pr-10"
        />
      </VStack>

      <VStack>
        <span className="text-base font-bold">Your assets</span>

        <VStack spacing={12}>
          <BalanceItem title="TON balance" value={prettyNumber(Number(balance || 0).toFixed(6))} />
          {/* <BalanceItem title="NOT balance" value={prettyNumber(20000)} /> */}
        </VStack>
      </VStack>

      <Button
        onClick={handleDisconnectWallet}
        className="h-11 bg-white border border-primary rounded-xl font-medium text-base text-primary"
      >
        Disconnect Wallet
      </Button>
    </VStack>
  );
};

export default WalletTab;
