import { HStack, VStack } from '@/components/ui/Utilities';
import { roundNumber } from '@/lib/common';
import React, { FC, ReactNode, useMemo } from 'react';
import CollectItemSkeleton from './CollectItemSkeleton';
import TonImage from '@/components/TonImage';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  rewardValue: number;
  feeValue: number;
  totalValue: number;
  usdValue: number;
  feeUsdValue: number;
  totalUsdValue: number;
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
  isLoading,
  claimFee,
}) => {
  const showTotalComponent = useMemo(() => {
    if (isLoading) {
      return (
        <VStack>
          <VStack className="border-y border-y-gray-color py-4">
            <CollectItemSkeleton />
            <CollectItemSkeleton />
          </VStack>

          <VStack>
            <CollectItemSkeleton />

            <HStack pos={'right'}>
              <Skeleton className="h-6 w-28 bg-background" />
            </HStack>
          </VStack>
        </VStack>
      );
    }

    return (
      <VStack>
        <div className="border-t border-t-gray-color">
          <VStack spacing={8} className="pt-4">
            <SubCollectTotalItem
              title={'Total Rewards'}
              value={
                <HStack>
                  <span>{roundNumber(rewardValue || 0)}</span>

                  <TonImage width={24} height={24} />
                </HStack>
              }
              usdValue={String(roundNumber(usdValue || 0))}
            />
            <SubCollectTotalItem
              title={`Claim Fees ${claimFee}%`}
              value={
                <HStack>
                  <span>-{roundNumber(feeValue || 0)}</span>

                  <TonImage width={24} height={24} />
                </HStack>
              }
              usdValue={String(roundNumber(feeUsdValue || 0))}
            />
          </VStack>
        </div>

        <CollectTotalItem
          title={'Total Unclaimed Rewards'}
          value={
            <HStack>
              <span>{roundNumber(totalValue || 0)}</span>

              <TonImage width={24} height={24} />
            </HStack>
          }
          usdValue={String(roundNumber(totalUsdValue || 0))}
        />
      </VStack>
    );
  }, [claimFee, feeUsdValue, feeValue, isLoading, rewardValue, totalUsdValue, totalValue, usdValue]);

  return showTotalComponent;
};

export default CollectTotal;

interface ISubCollectTotalItem {
  title: string;
  value: string | ReactNode;
  usdValue: string;
}

const SubCollectTotalItem: FC<ISubCollectTotalItem> = ({ title, value }) => {
  return (
    <HStack pos={'apart'}>
      <span className="text-right">{title}</span>
      <span className="text-primary text-xl">{value}</span>
    </HStack>
  );
};

interface ICollectTotalItem extends ISubCollectTotalItem {}

const CollectTotalItem: FC<ICollectTotalItem> = ({ title, value, usdValue }) => {
  return (
    <VStack spacing={0} className="border-t border-t-gray-color pt-4 ">
      <HStack pos={'apart'}>
        <span className="font-bold">{title}</span>

        <span className="text-2xl bg-gradient-to-r from-primary font-bold to-[#ED9BD6] inline-block text-transparent bg-clip-text">
          {value}
        </span>
      </HStack>

      <HStack pos={'right'}>
        <span className="text-gray-color text-sm">~ {usdValue} USD</span>
      </HStack>
    </VStack>
  );
};
