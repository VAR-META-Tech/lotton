import { VStack } from '@/components/ui/Utilities';
import { useGetPoolsCollectPrize } from '@/hooks/useGetPoolsCollectPrize';
import React, { FC, useMemo } from 'react';

import { env } from '@/lib/const';
import CollectItem from './CollectItem';
import CollectTotal from './CollectTotal';
import ClaimAction from './ClaimAction';

interface Props {
  poolId: number;
  roundId: number;
}

const CollectWinning: FC<Props> = ({ poolId, roundId }) => {
  const { items } = useGetPoolsCollectPrize(999999999999999, poolId, roundId);

  const totalRewardValue = useMemo(() => {
    const total = items?.reduce((acc, item) => {
      return acc + Number(item?.winningPrize);
    }, 0);

    return total;
  }, [items]);

  const feeValue = useMemo(() => {
    return (Number(totalRewardValue || 0) * Number(env.CLAIM_FEE)) / 100;
  }, [totalRewardValue]);

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
              value={Number(item?.winningPrize)}
              roundNumber={item?.roundNumber}
              tokenSymbol={item?.currencySymbol}
              usdValue={100000}
            />
          );
        })}
      </VStack>

      <CollectTotal
        rewardValue={totalRewardValue}
        feeValue={feeValue}
        totalValue={totalValue}
        tokenSymbol={items[0]?.currencySymbol}
        usdValue={100000}
        feeUsdValue={0}
        totalUsdValue={10000}
      />

      <ClaimAction poolId={poolId} roundId={roundId} totalValue={totalValue} />
    </VStack>
  );
};

export default CollectWinning;
