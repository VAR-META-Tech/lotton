import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { HStack, Show } from '../ui/Utilities';
import { menuConfigs } from '@/lib/menu';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/AppStore';
import { ChevronLeft, CircleX, Menu } from 'lucide-react';
import { ConnectWallet } from '../ConnectWallet';
import { useParams } from 'next/navigation';

const Header = () => {
  const open = useAppStore.use.openSideBar();
  const toggle = useAppStore.use.toggleSidebar();
  const pathname = usePathname();
  const route = useRouter();
  const params = useParams();
  const id = params?.id;

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

        <HStack spacing={4}>
          <Show when={!!id || pathname.includes('create')}>
            <Button size={'sm'} variant="ghost" onClick={() => route.back()}>
              <ChevronLeft />
            </Button>
          </Show>

          {menuConfigs.map((menu, index) => (
            <p key={index} className='capitalize text-2xl text-[#000000] hidden md:block'>
              {pathname.includes(menu.link) && !!id ? (
                `${menu.name.split(' ')[0]} detail`
              ) : pathname.includes(menu.link) && pathname.includes('create') ? (
                `Create ${menu.name.split(' ')[0]}`
              ) : pathname.includes(menu.link) ? (
                menu.name
              ) : ''}
            </p>
          ))}
        </HStack>

        <ConnectWallet />
      </HStack>
    </div>
  );
};

export default Header;
