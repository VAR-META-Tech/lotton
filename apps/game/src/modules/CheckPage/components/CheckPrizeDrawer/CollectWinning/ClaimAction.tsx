import { useGetClaimSignatureMutation } from '@/apis/pools/mutations';
import { Button } from '@/components/ui/button';
import { HStack } from '@/components/ui/Utilities';
import { useAuth } from '@/hooks/useAuth';
import { usePoolContract } from '@/hooks/usePoolContract';
import { onMutateError } from '@/lib/common';
import React, { FC, useState } from 'react';
import { toast } from 'sonner';

interface Props {
  poolId: number;
  roundId: number;
  totalValue: number;
}

const ClaimAction: FC<Props> = ({ poolId, roundId, totalValue }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { claimPrize, getLastTx } = usePoolContract();
  const { user } = useAuth();

  const { mutate: getClaimSignature } = useGetClaimSignatureMutation({
    onSuccess: async (data) => {
      try {
        setLoading(true);
        const lastTx = await getLastTx();
        const lastTxHash = lastTx?.[0].hash().toString('base64');

        claimPrize({
          poolId: poolId,
          roundId: roundId,
          amount: totalValue * Math.pow(10, 9) || 0,
          receiver: user?.wallet || '',
          signature: data.signature,
        });

        let newLastTxHash = lastTxHash;
        while (newLastTxHash === lastTxHash) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          const updatedLastTx = await getLastTx();
          const isAbortedTx = (updatedLastTx?.[0]?.description as any)?.aborted;

          if (isAbortedTx) {
            toast.error('Claimed failed');
            return;
          }

          toast.success('Claim successful');

          newLastTxHash = updatedLastTx?.[0].hash().toString('base64');
        }
      } catch (error) {
        onMutateError(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleClaim = () => {
    getClaimSignature({
      poolId,
      roundId,
    });
  };

  return (
    <HStack pos={'center'}>
      <Button loading={loading} onClick={handleClaim} size={'lg'} className="rounded-lg w-fit bg-primary text-white">
        Claim
      </Button>
    </HStack>
  );
};

export default ClaimAction;
