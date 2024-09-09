import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

import { HStack, VStack } from '@/components/ui/Utilities';

import TextWrap from './TextWrap';

const WinningSection = () => {
  return (
    <VStack>
      <HStack>
        <VStack className="flex-1">
          <div className="flex flex-col gap-2 justify-center items-start">
            <p className="text-md">Winning Ticket Block</p>
            <div className="bg-[#ECEEF1] border border-[#8B8B94] min-w-[26.3125rem] rounded-[.1875rem] p-[.625rem] flex items-center whitespace-nowrap gap-3">
              <p className="font-sm">6771975b6b26718....0a5fc4fbf770298cb25b2a5</p>
              <Link href={'/'}>
                <ExternalLink className="text-[#8B8B94]" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2 justify-center items-start">
            <p className="text-md">Total Winning Amount</p>
            <div className="bg-[#ECEEF1] border border-[#8B8B94] min-w-[26.3125rem] rounded-[.1875rem] p-[.625rem] flex items-center whitespace-nowrap gap-3">
              <p className="font-sm">110.000 TON</p>
            </div>
          </div>
        </VStack>

        <div className="flex-1 min-h-[4.75rem] shadow-shadowCustom bg-[#ECEEF1] border border-[#8B8B94] min-w-[26.3125rem] rounded-[.1875rem] justify-around p-[.625rem] flex items-center whitespace-nowrap">
          <p className="font-sm">Winning Number</p>

          <HStack spacing={12}>
            <TextWrap text={'b'} />
            <TextWrap text={'2'} />
            <TextWrap text={'a'} />
            <TextWrap text={'5'} />
          </HStack>
        </div>
      </HStack>
    </VStack>
  );
};

export default WinningSection;
