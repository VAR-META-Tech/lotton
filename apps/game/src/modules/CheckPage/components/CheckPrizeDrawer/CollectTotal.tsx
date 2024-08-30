import { HStack, VStack } from '@/components/ui/Utilities';
import React, { FC } from 'react';

interface Props {
  rewardValue: number;
  feeValue: number;
  totalValue: number;
  usdValue: number;
  feeUsdValue: number;
  totalUsdValue: number;
  tokenSymbol: string;
}

const CollectTotal: FC<Props> = ({
  rewardValue,
  feeValue,
  totalValue,
  usdValue,
  feeUsdValue,
  totalUsdValue,
  tokenSymbol,
}) => {
  return (
    <VStack>
      <VStack className="border-t border-t-gray-color">
        <VStack>
          <span className="pt-4 font-bold">Total Rewards</span>

          <HStack pos={'apart'} className="font-bold">
            <span className="text-primary text-2xl">{`${Number(rewardValue || 0).toFixed(6)} ${tokenSymbol || ''}`}</span>

            <span className="text-gray-color text-sm">~ {Number(usdValue || 0).toFixed(6)} USD</span>
          </HStack>
        </VStack>

        <VStack>
          <span className="pt-4 font-bold">Claim Fees 10%</span>

          <HStack pos={'apart'} className="font-bold">
            <span className="text-primary text-2xl">{`${Number(feeValue || 0).toFixed(6)} ${tokenSymbol || ''}`}</span>

            <span className="text-gray-color text-sm">~ {Number(feeUsdValue || 0).toFixed(6)} USD</span>
          </HStack>
        </VStack>
      </VStack>

      <VStack className="border-t border-t-gray-color">
        <span className="pt-4 font-bold">Total Unclaimed Rewards</span>

        <HStack pos={'apart'} className="font-bold">
          <span className="text-2xl  bg-gradient-to-r from-primary  to-[#ED9BD6] inline-block text-transparent bg-clip-text">{`${Number(totalValue || 0).toFixed(6)} ${tokenSymbol || ''}`}</span>

          <span className="text-gray-color text-sm">~ {Number(totalUsdValue || 0).toFixed(6)} USD</span>
        </HStack>
      </VStack>
    </VStack>
  );
};

export default CollectTotal;
