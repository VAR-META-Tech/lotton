'use client';

import Link from 'next/link';
import { HStack, VStack } from '@/components/ui/Utilities';
import { cn } from '@/lib/utils';
import type { FCC } from '@/types';
import { usePathname } from 'next/navigation';
import { menuConfigs } from '@/lib/menu';
import { useAppStore } from '@/stores/AppStore';
import { LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { useUserStore } from '@/stores';
import { IUser } from '@/apis/auth';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';

interface Props {
  active?: boolean;
  icon: any;
  href: string;
}

const MenuLink: FCC<Props> = ({ active, icon, children, href }) => {
  return (
    <Link
      href={href}
      className={cn(
        'text-white hover:shadow-active w-full text-base justify-start transition-all duration-150 active:scale-100 border-b border-t py-5 pl-5 border-[#8B8B94]',
        {
          'text-[#FFBF00]': active,
        }
      )}
    >
      <HStack spacing={8}>
        <div>{icon}</div>
        {children}
      </HStack>
    </Link>
  );
};
const Sidebar = () => {
  const open = useAppStore.use.openSideBar();
  const pathname = usePathname();
  const router = useRouter();
  const setAccessToken = useUserStore.use.setAccessToken();
  const setUser = useUserStore.use.setUser();

  const handleLogout = () => {
    router.replace(ROUTES.LOGIN);
    setAccessToken('');
    setUser({} as IUser);
    toast.success('Logout successfully!');
  };

  return (
    <>
      <div
        className={cn(
          'max-w-[16.25rem] fixed left-0 bg-[#262626] top-[4.125rem] w-full md:top-0 bottom-0 z-50 border-r transition-all',
          {
            '-left-[16.25rem] md:left-0': !open,
          }
        )}
      >
        <p className='text-2xl font-bold h-[4rem] text-white py-4 px-8'>ADMIN PORTAL</p>

        <VStack spacing={8}>
          {menuConfigs.map((menu, index) => (
            <MenuLink
              key={index}
              href={menu.link}
              icon={<span className="h-4 w-4">{menu.icon}</span>}
              active={pathname.includes(menu.link)}
            >
              {menu.name}
            </MenuLink>
          ))}
        </VStack>

        <VStack spacing={4} className={cn(
          'max-w-[16.20rem] fixed left-0 w-full bottom-0',
          {
            '-left-[16.25rem] md:left-0': !open,
          }
        )}>
          <div className='delay-500 md:delay-0 bg-[#8B8B94] w-full h-[.0313rem]'/>

          <Button className='bg-transparent h-[3.375rem] gap-2 rounded-none' onClick={handleLogout}>
            <LogOut /> LOG OUT
          </Button>
        </VStack>
      </div>
    </>
  );
};

export default Sidebar;
