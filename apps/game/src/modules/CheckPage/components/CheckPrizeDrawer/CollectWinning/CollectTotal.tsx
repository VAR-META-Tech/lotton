import { HStack, VStack } from '@/components/ui/Utilities';
import { roundNumber } from '@/lib/common';
import React, { FC, useMemo } from 'react';
import CollectItemSkeleton from './CollectItemSkeleton';

interface Props {
  rewardValue: number;
  feeValue: number;
  totalValue: number;
  usdValue: number;
  feeUsdValue: number;
  totalUsdValue: number;
  tokenSymbol: string;
  isLoading: boolean;
  claimFee: number;
}

const CollectTotal: FC<Props> = ({
  rewardValue,
  feeValue,
  totalValue,
  usdValue,
  feeUsdValue,
  totalUsdValue,
  tokenSymbol,
  isLoading,
  claimFee,
}) => {
  const showTotalComponent = useMemo(() => {
    if (!isLoading)
      return (
        <VStack>
          <VStack className="border-t border-t-gray-color">
            <SubCollectTotalItem
              title={'Total Rewards'}
              value={`${roundNumber(rewardValue || 0)} ${tokenSymbol || ''}`}
              usdValue={String(roundNumber(usdValue || 0))}
            />
            <SubCollectTotalItem
              title={`Claim Fees ${claimFee}%`}
              value={`${roundNumber(feeValue || 0)} ${tokenSymbol || ''}`}
              usdValue={String(roundNumber(feeUsdValue || 0))}
            />
          </VStack>

          <CollectTotalItem
            title={'Total Unclaimed Rewards'}
            value={`${roundNumber(totalValue || 0)} ${tokenSymbol || ''}`}
            usdValue={String(roundNumber(totalUsdValue || 0))}
          />
        </VStack>
      );

    return (
      <VStack>
        <VStack className="border-t border-t-gray-color">
          <CollectItemSkeleton />
          <CollectItemSkeleton />
        </VStack>

        <CollectItemSkeleton />
      </VStack>
    );
  }, [claimFee, feeUsdValue, feeValue, isLoading, rewardValue, tokenSymbol, totalUsdValue, totalValue, usdValue]);

  return showTotalComponent;
};

export default CollectTotal;

interface ISubCollectTotalItem {
  title: string;
  value: string;
  usdValue: string;
}

const SubCollectTotalItem: FC<ISubCollectTotalItem> = ({ title, value, usdValue }) => {
  return (
    <VStack spacing={12}>
      <span className="pt-4">{title}</span>

      <HStack pos={'apart'}>
        <span className="text-primary text-xl">{value}</span>

        <span className="text-gray-color text-sm">~ {usdValue} USD</span>
      </HStack>
    </VStack>
  );
};

interface ICollectTotalItem extends ISubCollectTotalItem {}

const CollectTotalItem: FC<ICollectTotalItem> = ({ title, value, usdValue }) => {
  return (
    <VStack className="border-t border-t-gray-color">
      <span className="pt-4 font-bold">{title}</span>

      <HStack pos={'apart'} className="font-bold">
        <span className="text-2xl bg-gradient-to-r from-primary  to-[#ED9BD6] inline-block text-transparent bg-clip-text">
          {value}
        </span>

        <span className="text-gray-color text-sm">~ {usdValue} USD</span>
      </HStack>
    </VStack>
  );
};
