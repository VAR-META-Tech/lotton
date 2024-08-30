import { Button } from '@/components/ui/button';
import { HStack, VStack } from '@/components/ui/Utilities';
import { useGetPoolsCollectPrize } from '@/hooks/useGetPoolsCollectPrize';
import React, { FC, useMemo } from 'react';
import CollectItem from './CollectItem';
import CollectTotal from './CollectTotal';
import { useGetClaimSignatureMutation } from '@/apis/pools/mutations';
import { usePoolContract } from '@/hooks/usePoolContract';
import { useAuth } from '@/hooks/useAuth';
import { env } from '@/lib/const';

interface Props {
  poolId: number;
  roundId: number;
}

const CollectWinning: FC<Props> = ({ poolId, roundId }) => {
  const { items } = useGetPoolsCollectPrize(999999999999999, poolId, roundId);
  const { claimPrize } = usePoolContract();
  const { user } = useAuth();

  const handleClaim = () => {
    getClaimSignature({
      poolId,
      roundId,
    });
  };

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

  const { mutate: getClaimSignature } = useGetClaimSignatureMutation({
    onSuccess: (data) => {
      claimPrize({
        poolId: poolId,
        roundId: roundId,
        amount: totalValue * Math.pow(10, 9) || 0,
        receiver: user?.wallet || '',
        signature: data.signature,
      });
    },
  });

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

      <HStack pos={'center'}>
        <Button onClick={handleClaim} size={'lg'} className="rounded-lg w-fit bg-primary text-white">
          Claim
        </Button>
      </HStack>
    </VStack>
  );
};

export default CollectWinning;
