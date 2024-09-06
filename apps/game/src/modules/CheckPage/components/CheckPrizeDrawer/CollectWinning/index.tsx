import { VStack } from '@/components/ui/Utilities';
import { useGetPoolsCollectPrize } from '@/hooks/useGetPoolsCollectPrize';
import React, { FC, useMemo } from 'react';

import CollectItem from './CollectItem';
import CollectTotal from './CollectTotal';
import ClaimAction from './ClaimAction';
import { fromNano } from '@ton/core';
import { usePoolContract } from '@/hooks/usePoolContract';

interface Props {
  poolId: number;
  roundId: number;
}

const CollectWinning: FC<Props> = ({ poolId, roundId }) => {
  const { claimFee } = usePoolContract();
  const { items } = useGetPoolsCollectPrize(999999999999999, poolId, roundId);

  const totalRewardValue = useMemo(() => {
    const total = items?.reduce((acc, item) => {
      return acc + Number(item?.winningPrize);
    }, 0);

    return Number(fromNano(total));
  }, [items]);

  const feeValue = useMemo(() => {
    return (Number(totalRewardValue || 0) * Number(claimFee)) / 100;
  }, [claimFee, totalRewardValue]);

  const totalValue = useMemo(() => {
    return Number(totalRewardValue || 0) - Number(feeValue || 0);
  }, [totalRewardValue, feeValue]);

  return (
    <VStack className="container">
      <VStack>
        {items?.map((item, index) => {
          return (
            <CollectItem
              key={`${item?.poolId}-${index}`}
              code={item?.ticketCode}
              value={Number(fromNano(item?.winningPrize || 0))}
              roundNumber={item?.roundNumber}
              tokenSymbol={item?.currencySymbol}
              usdValue={0}
            />
          );
        })}
      </VStack>

      <CollectTotal
        rewardValue={totalRewardValue}
        feeValue={feeValue}
        totalValue={totalValue}
        tokenSymbol={items[0]?.currencySymbol}
        usdValue={0}
        feeUsdValue={0}
        totalUsdValue={0}
      />

      <ClaimAction poolId={poolId} roundId={roundId} />
    </VStack>
  );
};

export default CollectWinning;
