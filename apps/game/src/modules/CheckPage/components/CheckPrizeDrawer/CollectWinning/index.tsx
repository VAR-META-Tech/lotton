import { VStack } from '@/components/ui/Utilities';
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
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  poolId: number;
  roundId: number;
}

const CollectWinning: FC<Props> = ({ poolId, roundId }) => {
  const { claimFee } = usePoolContract();
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

  const feeValue = useMemo(() => (totalRewardValue * claimFee) / 100, [claimFee, totalRewardValue]);

  const totalValue = useMemo(() => totalRewardValue - feeValue, [totalRewardValue, feeValue]);

  const loading = useMemo(() => isLoading || !feeValue || !totalValue, [feeValue, isLoading, totalValue]);

  const renderCurrentRound = useMemo(() => {
    if (loading) {
      return <Skeleton className="h-7 w-20 bg-background" />;
    }

    return <span className="font-bold text-lg">Round {(!!items?.length && items[0]?.roundNumber) || 0}</span>;
  }, [items, loading]);

  const renderContent = useMemo(() => {
    if (loading) {
      return Array.from({ length: 2 }).map((_, index) => <CollectItemSkeleton key={index} />);
    }

    return items?.map((item, index) => {
      const winningPrize = Number(fromNano(roundNumber(item?.winningPrize || 0, 0)));

      return <CollectItem key={`${item?.poolId}-${index}`} code={item?.ticketCode} value={winningPrize} />;
    });
  }, [items, loading]);

  return (
    <VStack className="container">
      <VStack>
        {renderCurrentRound}

        {renderContent}
      </VStack>

      <CollectTotal
        rewardValue={totalRewardValue}
        feeValue={feeValue}
        totalValue={totalValue}
        totalUsdValue={totalValue * price}
        isLoading={loading}
        claimFee={claimFee}
      />

      <ClaimAction poolId={poolId} roundId={roundId} />
    </VStack>
  );
};

export default CollectWinning;
