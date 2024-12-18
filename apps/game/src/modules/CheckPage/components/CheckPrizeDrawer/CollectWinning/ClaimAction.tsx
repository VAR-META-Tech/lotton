import { useConfirmClaimMutation, useGetClaimSignatureMutation } from '@/apis/pools/mutations';
import { Button } from '@/components/ui/button';
import { HStack } from '@/components/ui/Utilities';
import { useAuth } from '@/hooks/useAuth';
import { usePoolContract } from '@/hooks/usePoolContract';
import { useWinPools } from '@/hooks/useWinPools';
import { delay, onMutateError } from '@/lib/common';
import { useClaimStore } from '@/stores/ClaimStore';
import React, { FC, useState } from 'react';
import { toast } from 'sonner';

interface Props {
  poolId: number;
  roundId: number;
  isLoading: boolean;
}

const ClaimAction: FC<Props> = ({ poolId, roundId, isLoading }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { claimPrize, getLastTx } = usePoolContract();
  const { user } = useAuth();
  const setIsOpen = useClaimStore.use.setIsOpen();

  const { refetch } = useWinPools();

  const { mutateAsync: confirm, isPending: loadingConfirmClaim } = useConfirmClaimMutation({
    onError: onMutateError,
  });

  const handleTransaction = (status: 'success' | 'error', msg: string) => {
    if (status === 'success') {
      toast.success(msg);
    } else {
      toast.error(msg);
    }

    setIsOpen(false);
  };

  const { mutate: getClaimSignature, isPending: loadingSignature } = useGetClaimSignatureMutation({
    onSuccess: async (data) => {
      try {
        setLoading(true);
        // const lastTx = await getLastTx();
        // const lastTxHash = lastTx?.[0].hash().toString('base64');

        await claimPrize({
          poolId: data?.roundExits?.poolIdOnChain,
          roundId: data?.roundExits?.roundIdOnChain,
          amount: Number(data?.unitPrizes),
          receiver: user?.wallet || '',
          signature: data?.signature,
        });

        // let newLastTxHash = lastTxHash;
        // while (newLastTxHash === lastTxHash) {
        //   await delay(5000);
        //   const updatedLastTx = await getLastTx();

        //   if (updatedLastTx?.[0].hash().toString('base64') === newLastTxHash) {
        //     continue;
        //   }

        //   const isAbortedTx = (updatedLastTx?.[0]?.description as any)?.aborted;

        //   if (isAbortedTx) {
        //     handleTransaction('error', 'Claimed failed');
        //     return;
        //   }

        //   newLastTxHash = updatedLastTx?.[0].hash().toString('base64');
        // }

        // if (newLastTxHash !== lastTxHash) {
        await confirm({
          roundId: roundId,
        });
        refetch();
        handleTransaction('success', 'Transaction claim in progress');
        // }
      } catch (error) {
        onMutateError(error);
      } finally {
        setLoading(false);
      }
    },
    onError: onMutateError,
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
        disabled={isLoading || loading || loadingConfirmClaim || loadingSignature}
        loading={loading || loadingConfirmClaim || loadingSignature}
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
