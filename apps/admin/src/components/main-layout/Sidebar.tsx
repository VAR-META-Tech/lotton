'use client';

import Link from 'next/link';
import { HStack, VStack } from '@/components/ui/Utilities';
import { cn } from '@/lib/utils';
import type { FCC } from '@/types';
import { usePathname } from 'next/navigation';
import { menuConfigs } from '@/lib/menu';
import { useAppStore } from '@/stores/AppStore';

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
              active={pathname === menu.link}
            >
              {menu.name}
            </MenuLink>
          ))}
        </VStack>
      </div>
    </>
  );
};

export default Sidebar;
