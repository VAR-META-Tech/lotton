import React, { FC, HTMLAttributes, useMemo, useState } from 'react';
import Image from 'next/image';
import { Icons } from '@/assets/icons';
import { MAX_TICKET, MIN_TICKET } from '@/modules/LandingPage/utils/const';
import { FCC } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';

import { onMutateError, prettyNumber } from '@/lib/common';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { HStack, VStack } from '@/components/ui/Utilities';
import { usePoolContract } from '@/hooks/usePoolContract';
import { useWallet } from '@/hooks/useWallet';
import { useForm } from 'react-hook-form';
import { buyTicketSchema, BuyTicketType } from '@/modules/LandingPage/types/schema';
import { IGetPoolDetailCurrency } from '@/apis/pools';
import { FormWrapper } from '@/components/ui/form';
import { toast } from 'sonner';
import { useBuyTicketStore } from '@/stores/BuyTicketStore';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  ticketPrice: number;
  currency: IGetPoolDetailCurrency | undefined;
  roundIdOnChain: number;
  poolIdOnChain: number;
}

const BuyTicketForm: FC<Props> = ({ ticketPrice, currency, poolIdOnChain, roundIdOnChain }) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<boolean>(false);
  const { buyTicket, getLastTx } = usePoolContract();
  const { balance } = useWallet();
  const clear = useBuyTicketStore.use.clear();

  const form = useForm<BuyTicketType>({
    resolver: zodResolver(buyTicketSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const {
    setValue,
    watch,
    formState: { errors },
    clearErrors,
  } = form;

  const [amount] = watch(['amount']);

  const isMax = amount === MAX_TICKET;
  const isMin = amount === MIN_TICKET;
  const tokenSymbol = currency?.symbol || '';

  const onAmountChange = (type: 'plus' | 'minus') => {
    clearErrors('amount');

    if ((isMin && type === 'minus') || (isMax && type === 'plus')) return;

    if (type === 'plus') {
      setValue('amount', amount + 1);
      return;
    }

    setValue('amount', amount - 1);
  };

  const totalAmount = useMemo(() => {
    if (!amount || !ticketPrice) return 0;

    return Number(amount) * Number(ticketPrice);
  }, [amount, ticketPrice]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const lastTx = await getLastTx();
      const lastTxHash = lastTx?.[0].hash().toString('base64');

      buyTicket({
        poolId: poolIdOnChain || 0,
        quantity: amount,
        roundId: roundIdOnChain,
      });

      let newLastTxHash = lastTxHash;
      while (newLastTxHash === lastTxHash) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const updatedLastTx = await getLastTx();
        const isAbortedTx = (updatedLastTx?.[0]?.description as any)?.aborted;

        if (isAbortedTx) {
          toast.error('Buy tickets unsuccessful');

          queryClient.refetchQueries({
            queryKey: ['/api/pools'],
          });

          clear();

          return;
        }

        newLastTxHash = updatedLastTx?.[0].hash().toString('base64');
      }

      if (newLastTxHash !== lastTxHash) {
        toast.success('Buy tickets successful');

        queryClient.refetchQueries({
          queryKey: ['/api/pools'],
        });

        clear();
      }
    } catch (error) {
      onMutateError(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper form={form} onSubmit={handleSubmit}>
      <VStack spacing={24}>
        <VStack spacing={20} className="text-white border-b-[1px] border-b-gray-color pb-6">
          <HStack pos={'apart'}>
            <span className="text-base font-medium">Ticket Price:</span>

            <HStack spacing={8}>
              <Image src={'/images/tokens/ton_symbol.webp'} width={24} height={24} alt="ton" />

              <span className="text-2xl">{`${prettyNumber(ticketPrice)} ${tokenSymbol}`}</span>
            </HStack>
          </HStack>

          <VStack spacing={2}>
            <HStack pos={'apart'}>
              <span className="text-base font-medium">Amount</span>

              <HStack spacing={8}>
                <ChangeAmountButton isDisabled={isMin} onClick={() => onAmountChange('minus')}>
                  <Icons.minus
                    className={cn('text-primary', {
                      'text-gray-color': isMin,
                    })}
                  />
                </ChangeAmountButton>

                <span className="text-2xl font-semibold w-8 text-center">{amount}</span>

                <ChangeAmountButton isDisabled={isMax} onClick={() => onAmountChange('plus')}>
                  <Icons.plus
                    className={cn('text-primary', {
                      'text-gray-color': isMax,
                    })}
                  />
                </ChangeAmountButton>
              </HStack>
            </HStack>
            {errors?.amount?.message && (
              <span className="text-red-500 text-right text-xs">{errors?.amount?.message}</span>
            )}
          </VStack>
        </VStack>

        <VStack spacing={0}>
          <HStack pos={'apart'} className="text-white">
            <span className="text-base font-bold">You pay:</span>

            <HStack spacing={8}>
              <Image src={currency?.icon || '/images/tokens/ton_symbol.webp'} width={24} height={24} alt="ton" />

              <span className="text-2xl">{`${prettyNumber(totalAmount)} ${tokenSymbol}`}</span>
            </HStack>
          </HStack>
          <HStack pos={'apart'}>
            <span className="text-xs text-white">{`${tokenSymbol} balance: ${prettyNumber(
              Number(balance || 0).toFixed(6)
            )} ${tokenSymbol}`}</span>

            <span className="text-base text-gray-color">{`~ ${prettyNumber(0)} USD`}</span>
          </HStack>
        </VStack>

        <Button loading={loading} type="submit" size={'lg'} className="text-base font-medium mt-10 text-white">
          Buy
        </Button>
      </VStack>
    </FormWrapper>
  );
};

export default BuyTicketForm;

interface IChangeAmountButtonProps extends HTMLAttributes<HTMLButtonElement> {
  isDisabled: boolean;
}

const ChangeAmountButton: FCC<IChangeAmountButtonProps> = ({ isDisabled, children, ...props }) => {
  return (
    <button
      disabled={isDisabled}
      type="button"
      className={cn(
        'bg-white border border-primary rounded-[0.3125rem] w-[2.1875rem] h-[1.6875rem] flex justify-center items-center',
        {
          'border-gray-color': isDisabled,
        }
      )}
      {...props}
    >
      {children}
    </button>
  );
};
