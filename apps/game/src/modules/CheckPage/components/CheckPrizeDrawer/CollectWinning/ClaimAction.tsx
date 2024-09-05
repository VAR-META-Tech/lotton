import { useGetClaimSignatureMutation } from '@/apis/pools/mutations';
import { Button } from '@/components/ui/button';
import { HStack } from '@/components/ui/Utilities';
import { useAuth } from '@/hooks/useAuth';
import { usePoolContract } from '@/hooks/usePoolContract';
import { onMutateError } from '@/lib/common';
import { useClaimStore } from '@/stores/ClaimStore';
import React, { FC, useState } from 'react';
import { toast } from 'sonner';

interface Props {
  poolId: number;
  roundId: number;
}

const ClaimAction: FC<Props> = ({ poolId, roundId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { claimPrize, getLastTx } = usePoolContract();
  const { user } = useAuth();
  const setIsOpen = useClaimStore.use.setIsOpen();

  const { mutate: getClaimSignature } = useGetClaimSignatureMutation({
    onSuccess: async (data) => {
      try {
        setLoading(true);
        const lastTx = await getLastTx();
        const lastTxHash = lastTx?.[0].hash().toString('base64');

        claimPrize({
          poolId: data?.roundExits?.poolIdOnChain,
          roundId: data?.roundExits?.roundIdOnChain,
          amount: Number(data?.unitPrizes),
          receiver: user?.wallet || '',
          signature: data?.signature,
        });

        let newLastTxHash = lastTxHash;
        while (newLastTxHash === lastTxHash) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          const updatedLastTx = await getLastTx();
          const isAbortedTx = (updatedLastTx?.[0]?.description as any)?.aborted;

          if (isAbortedTx) {
            toast.error('Claimed failed');

            setIsOpen(false);

            return;
          }

          newLastTxHash = updatedLastTx?.[0].hash().toString('base64');
        }

        if (newLastTxHash !== lastTxHash) {
          toast.success('Claim successful');

          setIsOpen(false);
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
      <Button
        loading={loading}
        onClick={handleClaim}
        size={'lg'}
        className="rounded-lg w-fit bg-primary text-white min-w-52"
      >
        Claim
      </Button>
    </HStack>
  );
};

export default ClaimAction;
