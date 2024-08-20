import React from 'react';
import { FCC } from '@/types';

import { VStack } from '@/components/ui/Utilities';

import NavigateTab from './components/NavigateTab';

const MainLayout: FCC = ({ children }) => {
  return (
    <VStack className="relative flex flex-col md:hidden">
      <main className="bg-background mx-auto min-h-screen w-full grow text-clip">{children}</main>

      <NavigateTab />
    </VStack>
  );
};

export default MainLayout;
