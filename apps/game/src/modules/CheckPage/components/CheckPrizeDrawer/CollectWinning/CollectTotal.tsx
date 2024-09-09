import { HStack, VStack } from '@/components/ui/Utilities';
import { usePoolContract } from '@/hooks/usePoolContract';
import { roundNumber } from '@/lib/common';
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
  const { claimFee } = usePoolContract();

  return (
    <VStack>
      <VStack className="border-t border-t-gray-color">
        <VStack>
          <span className="pt-4 font-bold">Total Rewards</span>

          <HStack pos={'apart'} className="font-bold">
            <span className="text-primary text-2xl">{`${roundNumber(rewardValue || 0)} ${tokenSymbol || ''}`}</span>

            <span className="text-gray-color text-sm">~ {roundNumber(usdValue || 0)} USD</span>
          </HStack>
        </VStack>

        <VStack>
          <span className="pt-4 font-bold">Claim Fees {claimFee}%</span>

          <HStack pos={'apart'} className="font-bold">
            <span className="text-primary text-2xl">{`${roundNumber(feeValue || 0)} ${tokenSymbol || ''}`}</span>

            <span className="text-gray-color text-sm">~ {roundNumber(feeUsdValue || 0)} USD</span>
          </HStack>
        </VStack>
      </VStack>

      <VStack className="border-t border-t-gray-color">
        <span className="pt-4 font-bold">Total Unclaimed Rewards</span>

        <HStack pos={'apart'} className="font-bold">
          <span className="text-2xl  bg-gradient-to-r from-primary  to-[#ED9BD6] inline-block text-transparent bg-clip-text">{`${roundNumber(totalValue || 0)} ${tokenSymbol || ''}`}</span>

          <span className="text-gray-color text-sm">~ {roundNumber(totalUsdValue || 0)} USD</span>
        </HStack>
      </VStack>
    </VStack>
  );
};

export default CollectTotal;
