import { Show, VStack } from '@/components/ui/Utilities';
import { useGetPoolsCollectPrize } from '@/hooks/useGetPoolsCollectPrize';
import React, { FC, useMemo } from 'react';

import CollectItem from './CollectItem';
import CollectTotal from './CollectTotal';
import ClaimAction from './ClaimAction';
import { fromNano } from '@ton/core';
import { usePoolContract } from '@/hooks/usePoolContract';
import { useGetPoolDetail } from '@/hooks/useGetPoolDetail';
import { useGetTokenPrice } from '@/hooks/useGetTokenPrice';
import { roundNumber } from '@/lib/common';
import CollectItemSkeleton from './CollectItemSkeleton';

interface Props {
  poolId: number;
  roundId: number;
}

const CollectWinning: FC<Props> = ({ poolId, roundId }) => {
  const { claimFee } = usePoolContract();
  console.log('🚀 ~ claimFee:', claimFee);
  const { items, isLoading } = useGetPoolsCollectPrize(999999999999999, poolId, roundId);

  const { currency } = useGetPoolDetail({
    poolId: poolId,
    isActive: true,
  });

  const { price } = useGetTokenPrice(currency?.id || 0);

  const totalRewardValue = useMemo(() => {
    const total = items?.reduce((acc, item) => {
      return acc + Number(item?.winningPrize);
    }, 0);

    return Number(fromNano(total));
  }, [items]);

  const feeValue = useMemo(() => {
    return (totalRewardValue * claimFee) / 100;
  }, [claimFee, totalRewardValue]);

  const totalValue = useMemo(() => {
    return Number(totalRewardValue || 0) - Number(feeValue || 0);
  }, [totalRewardValue, feeValue]);

  return (
    <VStack className="container">
      <Show when={isLoading}>
        {Array.from({ length: 2 }).map((_, index) => (
          <CollectItemSkeleton key={index} />
        ))}
      </Show>

      <VStack>
        {items?.map((item, index) => {
          const winningPrize = Number(fromNano(roundNumber(item?.winningPrize || 0, 0)));
          const winningPrizeUsd = winningPrize * price;

          return (
            <CollectItem
              key={`${item?.poolId}-${index}`}
              code={item?.ticketCode}
              value={winningPrize}
              roundClaimNumber={item?.roundNumber}
              tokenSymbol={item?.currencySymbol}
              usdValue={winningPrizeUsd}
            />
          );
        })}
      </VStack>

      <CollectTotal
        rewardValue={totalRewardValue}
        feeValue={feeValue}
        totalValue={totalValue}
        tokenSymbol={items[0]?.currencySymbol}
        usdValue={totalRewardValue * price}
        feeUsdValue={feeValue * price}
        totalUsdValue={totalValue * price}
        isLoading={isLoading}
        claimFee={claimFee}
      />

      <ClaimAction poolId={poolId} roundId={roundId} />
    </VStack>
  );
};

export default CollectWinning;
