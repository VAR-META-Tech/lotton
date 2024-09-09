import { LayoutDashboard } from 'lucide-react';

export const menuConfigs = [
  {
    name: 'Pool management',
    link: '/pool',
    icon: <LayoutDashboard className='text-[#FFBF00] w-4 h-4' />,
    active: true,
  },
  {
    name: 'Round management',
    link: '/round',
    icon: <LayoutDashboard className='text-[#FFBF00] w-4 h-4' />,
    active: false,
  },
];