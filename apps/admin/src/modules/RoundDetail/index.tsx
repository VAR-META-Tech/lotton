'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useGetRoundDetail } from '@/apis/pool';
import { Icons } from '@/assets/icons';

import { HStack, VStack } from '@/components/ui/Utilities';

import InfoCard from './components/InfoCard';
import WinningSection from './components/WinningSection';

export const RoundDetail = () => {
  const { id } = useParams();

  const { data: roundDetail } = useGetRoundDetail(String(id), { queryKey: ['/round/detail', id], enabled: !!id });

  const infoData = useMemo(() => {
    return [
      { title: 'Prize Pool', key: 'prizePool', desc: '0 TON', icon: <Icons.ticket /> },
      { title: 'Current Prize', key: 'currentPrize', desc: '0 TON', icon: <Icons.text fill="#8B8B94" /> },
      { title: 'Previous Prize', key: 'previousPrize', desc: '0 TON', icon: <Icons.text fill="#9333EA" /> },
      { title: 'Total Tickets', key: 'totalTickets', desc: '0', icon: <Icons.ticket2 /> },
      { title: 'Prize Users', key: 'prizePool', desc: '0', icon: <Icons.userGroup /> },
    ];
  }, []);

  return (
    <VStack className="mx-10 space-y-6">
      <HStack spacing={24}>
        {infoData.map((info) => (
          <InfoCard key={info.key} icon={info.icon} title={info.title} desc={info.desc} />
        ))}
      </HStack>

      <VStack className="mb-24 bg-white rounded-sm min-h-[12.5rem] px-8 py-12">
        <WinningSection />
      </VStack>
    </VStack>
  );
};
