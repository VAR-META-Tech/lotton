import React, { FC, useEffect, useMemo, useState } from 'react';
import { MAX_TICKET, MIN_TICKET } from '@/modules/LandingPage/utils/const';
import { zodResolver } from '@hookform/resolvers/zod';

import { delay, onMutateError } from '@/lib/common';
import { Button } from '@/components/ui/button';
import { VStack } from '@/components/ui/Utilities';
import { usePoolContract } from '@/hooks/usePoolContract';
import { useWallet } from '@/hooks/useWallet';
import { useForm } from 'react-hook-form';
import { buyTicketSchema, BuyTicketType } from '@/modules/LandingPage/types/schema';
import { IGetPoolDetailData, IGetPoolDetailRound } from '@/apis/pools';
import { FormWrapper } from '@/components/ui/form';
import { toast } from 'sonner';
import { useBuyTicketStore } from '@/stores/BuyTicketStore';
import { useQueryClient } from '@tanstack/react-query';
import { fromNano } from '@ton/core';
import { useGetTokenPrice } from '@/hooks/useGetTokenPrice';
import TicketPriceSection from './TicketPriceSection';
import PaymentSummary from './PaymentSummary';

interface Props {
  pool?: IGetPoolDetailData;
  roundActive: IGetPoolDetailRound;
}

const BuyTicketForm: FC<Props> = ({ pool, roundActive }) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const { buyTicket, getLastTx } = usePoolContract();
  const { balance: balanceValue } = useWallet();
  const clearStore = useBuyTicketStore.use.clear();

  const form = useForm<BuyTicketType>({
    resolver: zodResolver(buyTicketSchema),
    defaultValues: { amount: 1, balance: 0 },
  });

  const { price } = useGetTokenPrice(pool?.currency?.id || 0);
  const {
    setValue,
    watch,
    formState: { errors },
    clearErrors,
    setError,
  } = form;
  const [amount, balance] = watch(['amount', 'balance']);

  const ticketPrice = useMemo(() => Number(fromNano(pool?.ticketPrice || 0)), [pool?.ticketPrice]);
  const totalAmount = useMemo(() => Number(amount) * ticketPrice, [amount, ticketPrice]);
  const tokenSymbol = pool?.currency?.symbol || '';
  const isMax = amount === MAX_TICKET;
  const isMin = amount === MIN_TICKET;

  useEffect(() => {
    setValue('balance', balanceValue || 0);
  }, [balanceValue, setValue]);

  const handleAmountChange = (isIncrement: boolean) => {
    clearErrors('amount');
    if ((isMin && !isIncrement) || (isMax && isIncrement)) return;
    setValue('amount', amount + (isIncrement ? 1 : -1));
  };

  const handleTransaction = (status: 'success' | 'error', message: string) => {
    toast[status](message);

    queryClient.refetchQueries({
      queryKey: ['/api/pools'],
    });

    clearStore();
  };

  const handleSubmit = async () => {
    if (totalAmount > balanceValue) {
      setError('balance', { type: 'custom', message: 'Insufficient TON balance' });
      return;
    }

    setLoading(true);
    try {
      const lastTx = await getLastTx();
      const lastTxHash = lastTx?.[0].hash().toString('base64');

      await buyTicket({
        poolId: pool?.poolIdOnChain || 0,
        quantity: amount,
        roundId: roundActive.roundIdOnChain,
        ticketPrice,
      });

      let newTxHash = lastTxHash;
      while (newTxHash === lastTxHash) {
        await delay(5000);
        const updatedTx = await getLastTx();
        if (updatedTx?.[0].hash().toString('base64') === newTxHash) continue;

        const isAborted = (updatedTx?.[0]?.description as any)?.aborted;

        if (isAborted) return handleTransaction('error', 'Buy tickets unsuccessful');

        newTxHash = updatedTx?.[0].hash().toString('base64');
      }

      handleTransaction('success', 'Buy tickets successful');
    } catch (error) {
      onMutateError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper form={form} onSubmit={handleSubmit}>
      <VStack spacing={24}>
        <TicketPriceSection
          ticketPrice={ticketPrice}
          tokenSymbol={tokenSymbol}
          amount={amount}
          isMin={isMin}
          isMax={isMax}
          onAmountChange={handleAmountChange}
          errors={errors}
        />

        <PaymentSummary
          totalAmount={totalAmount}
          tokenSymbol={tokenSymbol}
          balance={balance}
          price={price}
          errors={errors}
        />
        <VStack className="mt-4">
          <span className="text-center text-xs italic text-white">Limit of 16 tickets per transaction</span>
          <Button loading={loading} type="submit" size="lg" className="text-base font-medium text-white">
            Buy
          </Button>
        </VStack>
      </VStack>
    </FormWrapper>
  );
};

export default BuyTicketForm;
