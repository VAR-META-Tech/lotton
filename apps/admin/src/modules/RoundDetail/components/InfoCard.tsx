import React from 'react';

import { HStack, VStack } from '@/components/ui/Utilities';

interface Props {
  icon?: React.ReactNode;
  title: string;
  desc: string;
}

const InfoCard = ({ icon, title, desc }: Props) => {
  return (
    <HStack className="bg-white min-w-[13rem] p-5 rounded-[.625rem]" spacing={16}>
      <div>{icon}</div>

      <VStack className="gap-1">
        <p className="text-xs">{title}</p>
        <p className="text-[1.375rem] font-bold">{desc}</p>
      </VStack>
    </HStack>
  );
};

export default InfoCard;
