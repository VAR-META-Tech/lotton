import { HStack, VStack } from '@/components/ui/Utilities';
import { roundNumber } from '@/lib/common';
import React, { FC, HTMLAttributes, ReactNode, useMemo } from 'react';
import TonImage from '@/components/TonImage';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import CollectTotalSkeleton from './CollectTotalSkeleton';

interface Props {
  rewardValue: number;
  feeValue: number;
  totalValue: number;
  totalUsdValue: number;
  isLoading: boolean;
  claimFee: number;
}

const CollectTotal: FC<Props> = ({ rewardValue, feeValue, totalValue, totalUsdValue, isLoading, claimFee }) => {
  const showTotalComponent = useMemo(() => {
    if (isLoading) {
      return (
        <VStack>
          <VStack spacing={8} className="border-y border-y-gray-color py-4">
            <CollectTotalSkeleton />
            <CollectTotalSkeleton titleClassName="h-5" />
          </VStack>

          <VStack spacing={2}>
            <CollectTotalSkeleton titleClassName="h-8" valueClassName="h-8" />

            <HStack pos={'right'}>
              <Skeleton className="h-4 w-28 bg-background" />
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
              className="font-bold"
              title={'Subtotal Prizes'}
              value={
                <HStack spacing={8}>
                  <span>{roundNumber(rewardValue || 0)}</span>

                  <TonImage width={24} height={24} />
                </HStack>
              }
            />
            <SubCollectTotalItem
              title={`Fees ${claimFee}%`}
              titleClassName="font-extralight text-sm"
              value={
                <HStack spacing={8}>
                  <span>-{roundNumber(feeValue || 0)}</span>

                  <TonImage width={24} height={24} />
                </HStack>
              }
            />
          </VStack>
        </div>

        <CollectTotalItem
          title={'Total Prizes'}
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
  }, [claimFee, feeValue, isLoading, rewardValue, totalUsdValue, totalValue]);

  return showTotalComponent;
};

export default CollectTotal;

interface ISubCollectTotalItem extends HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | ReactNode;
  titleClassName?: ISubCollectTotalItem['className'];
  valueClassName?: ISubCollectTotalItem['className'];
}

const SubCollectTotalItem: FC<ISubCollectTotalItem> = ({ title, value, titleClassName, valueClassName, className }) => {
  return (
    <HStack pos={'apart'} className={className}>
      <span className={cn('text-right', titleClassName)}>{title}</span>
      <span className={cn('text-primary text-lg', valueClassName)}>{value}</span>
    </HStack>
  );
};

interface ICollectTotalItem extends ISubCollectTotalItem {
  usdValue: string;
}

const CollectTotalItem: FC<ICollectTotalItem> = ({ title, value, usdValue, titleClassName, valueClassName }) => {
  return (
    <VStack spacing={0} className="border-t border-t-gray-color pt-4 ">
      <HStack pos={'apart'}>
        <span className={cn('font-bold text-2xl', titleClassName)}>{title}</span>

        <span
          className={cn(
            'text-2xl bg-gradient-to-r from-primary font-bold to-[#ED9BD6] inline-block text-transparent bg-clip-text',
            valueClassName
          )}
        >
          {value}
        </span>
      </HStack>

      <HStack pos={'right'}>
        <span className="text-gray-color text-xs">~ {usdValue} USD</span>
      </HStack>
    </VStack>
  );
};
