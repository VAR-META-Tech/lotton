'use client';

import React, { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/assets/icons';

import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { VStack } from '@/components/ui/Utilities';

interface ITab {
  icon: ForwardRefExoticComponent<SVGProps<SVGSVGElement> & RefAttributes<SVGSVGElement>>;
  name: string;
  href: string;
}

const TABS: ITab[] = [
  { icon: Icons.home, name: 'Home', href: ROUTES.LANDING },
  { icon: Icons.ticketStar, name: 'Check', href: ROUTES.CHECK },
  { icon: Icons.document, name: 'FAQ', href: ROUTES.FAQ },
  { icon: Icons.wallet, name: 'Wallet', href: ROUTES.WALLET },
];

const NavigateTab = () => {
  const pathname = usePathname();

  return (
    <div className="bg-navigate-tab fixed left-0 bottom-0 right-0 w-full h-20">
      <div className="grid grid-cols-4 gap-4 h-full">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.href === pathname;

          return (
            <Link key={tab?.name} href={tab?.href} className="col-span-1 h-full">
              <VStack spacing={4} key={tab?.name} className="h-full justify-center items-center">
                <Icon
                  className={cn('stroke-gray-color', {
                    'stroke-primary': isActive,
                  })}
                />

                <p
                  className={cn('text-sm text-gray-color', {
                    'text-primary': isActive,
                  })}
                >
                  {tab?.name}
                </p>
              </VStack>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default NavigateTab;
