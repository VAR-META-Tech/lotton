'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ConnectWallet } from '@/modules/PoolManagement/components/ConnectWallet';
import { HStack } from '../ui/Utilities';
import { menuConfigs } from '@/lib/menu';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/stores/AppStore';
import { CircleX, Menu } from 'lucide-react';

const Header = () => {
  const open = useAppStore.use.openSideBar();
  const toggle = useAppStore.use.toggleSidebar();
  const pathname = usePathname();

  return (
    <div
      className={cn(
        'left-0 md:left-[16.25rem] h-[4.125rem] bg-white fixed right-0 top-0 z-50 flex flex-nowrap items-center justify-between border-b py-4',
      )}
    >
      <HStack className='w-full justify-between px-5 md:px-10'>
        <Button className="block md:hidden" onClick={toggle} variant="ghost">
          {open ? <CircleX /> : <Menu />}
        </Button>

        {menuConfigs.map((menu, index) => (
          <p key={index} className='capitalize text-2xl text-[#000000] hidden md:block'>
            {pathname === menu.link ? menu.name : ''}
          </p>
        ))}

        <ConnectWallet />
      </HStack>
    </div>
  );
};

export default Header;
