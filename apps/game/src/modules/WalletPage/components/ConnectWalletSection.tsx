import React from 'react';
import Image from 'next/image';
import { ConnectWallet } from '@/modules/LandingPage/components/ConnectWallet';

import { VStack } from '@/components/ui/Utilities';

const ConnectWalletSection = () => {
  return (
    <VStack className="container min-h-screen" spacing={32} justify={'center'} align={'center'}>
      <Image src={'/images/yellow-wallet.webp'} alt="yellow-wallet" width={100} height={100} />

      <span className="text-white text-2xl font-bold">Connect your wallet</span>

      <ConnectWallet />
    </VStack>
  );
};

export default ConnectWalletSection;
