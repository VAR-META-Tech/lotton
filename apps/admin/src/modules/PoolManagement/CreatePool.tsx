'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetTokens } from '@/apis/pool';
import { useCreatePool } from '@/apis/pool/mutations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { SelectField, TextField } from '@/components/ui/FormField';
import { DateTimePickerField } from '@/components/ui/FormField/DateTimePickerField';
import FormWrapper from '@/components/ui/FormWrapper';
import { HStack, VStack } from '@/components/ui/Utilities';

import { poolSchema, PoolSchema } from './components/types';
import { ROUTES } from '@/lib/routes';
import { useCounterContract } from '@/hooks/useCounterContract';
import { Address, Dictionary } from '@ton/core';
import { parseUnits } from 'viem';
import { useTonConnect } from '@/hooks/useTonConnect';

export const SEQUENCY_OPTIONS = [
  { label: '1 day', value: '1' },
  { label: '3 days', value: '3' },
  { label: '1 week', value: '7' },
  { label: '2 weeks', value: '14' },
  { label: '1 month', value: '30' },
  { label: '2 months', value: '60' },
  { label: '3 months', value: '90' },
  { label: '6 months', value: '180' },
];

export const CreatePool = () => {
  const route = useRouter();
  const queryClient = useQueryClient();
  const { createPool, getLastTx } = useCounterContract();
  const [loading, setLoading] = useState<boolean>(false);
  const { connected } = useTonConnect();

  const methods = useForm<PoolSchema>({
    resolver: zodResolver(poolSchema),
  });

  const { data: tokenList } = useGetTokens({});

  const currencyOptions = useMemo(() => {
    if (!tokenList) return [];
    return tokenList?.data?.items.map((token) => ({
      label: token.name,
      value: String(token.id),
    }));
  }, [tokenList]);

  const { mutateAsync: createPoolMutate, isPending: isPendingCreate } = useCreatePool({
    onSuccess: () => {
      setLoading(true)
      // queryClient.invalidateQueries({ queryKey: ['/pools'] });
      // route.push(ROUTES.POOL);
      // toast.success('Create new pool successfully!');
    },
    onError: (error) => {
      setLoading(false)
      toast.error(`${error.message}`);
    },
  });
  
  const handleSubmit = async (values: PoolSchema) => {
    await createPoolMutate(
      {
        name: values.name,
        currency: Number(values.currency),
        sequency: Number(values.sequency) * 86400,
        totalRounds: Number(values.totalRounds),
        startTime: String(new Date(values.startTime).getTime() / 1000),
        ticketPrice: Number(parseUnits(values.ticketPrice, 9)),
        poolPrizes: [
          {
            matchNumber: 1,
            allocation: Number(values.match1),
          },
          {
            matchNumber: 2,
            allocation: Number(values.match2),
          },
          {
            matchNumber: 3,
            allocation: Number(values.match3),
          },
          {
            matchNumber: 4,
            allocation: Number(values.match4),
          },
        ],
      },
    );

    setLoading(true);
    const lastTx = await getLastTx();
    const lastTxHash = lastTx?.[0].hash().toString('base64');

    let prizes = Dictionary.empty(Dictionary.Keys.Uint(8), Dictionary.Values.Uint(8));
    prizes.set(1, Number(values.match1));
    prizes.set(2, Number(values.match2));
    prizes.set(3, Number(values.match3));
    prizes.set(4, Number(values.match4));

    await createPool({
      jettonWallet: Address.parse(
        '0QBmPzFlJnqlNaHV22V6midanLx7ch9yRBiUnv6sH8aMfIcP',
      ),
      ticketPrice: BigInt(parseUnits(values.ticketPrice, 9)),
      initialRounds: BigInt(Number(values.totalRounds)),
      startTime: BigInt(new Date(values.startTime).getTime() / 1000),
      endTime: BigInt(new Date(values.endTime).getTime() / 1000),
      sequence: BigInt(Number(values.sequency) * 86400),
      active: true,
      prizes,
    });

    let newLastTxHash = lastTxHash;
    while (newLastTxHash === lastTxHash) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const updatedLastTx = await getLastTx();
      const isAbortedTx = (updatedLastTx?.[0]?.description as any)?.aborted;

      if (isAbortedTx) {
        toast.error('Something went wrong!');
        setLoading(false);
        return;
      }
      newLastTxHash = updatedLastTx?.[0].hash().toString('base64');
    }

    setLoading(false);
    route.push(ROUTES.POOL);
    queryClient.invalidateQueries({ queryKey: ['/pools'] });
    toast.success('Create new pool successfully!');
  };

  const startTime = methods.watch('startTime');
  const sequency = methods.watch('sequency');
  const totalRound = methods.watch('totalRounds');

  useEffect(() => {
    if (!startTime || !sequency || !totalRound) return;

    const sequencyNum = Number(sequency);
    const totalRoundNum = Number(totalRound);
  
    if (isNaN(sequencyNum) || isNaN(totalRoundNum)) return;

    const startDate = new Date(startTime);

    startDate.setDate(startDate.getDate() + (sequencyNum * Number(totalRoundNum)));
  
    methods.setValue('endTime', startDate);
  }, [startTime, sequency, totalRound]);
  
  return (
    <VStack className="mx-4 md:mx-10 mb-24 bg-white rounded-sm min-h-[12.5rem] p-8 md:px-24 md:py-12">
      <div>
        <FormWrapper methods={methods} onSubmit={handleSubmit}>
          <VStack>
            <HStack className="justify-between items-start gap-20">
              <VStack className="flex-1 space-y-6">
                <div>
                  <TextField
                    control={methods.control}
                    fullWidth
                    name="name"
                    label="Pool Name"
                    className="max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94]"
                    placeholder="Enter pool name..."
                  />
                </div>

                <div>
                  <SelectField
                    data={SEQUENCY_OPTIONS}
                    control={methods.control}
                    fullWidth
                    name="sequency"
                    label="Sequency"
                    className="max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94] rounded-sm"
                    placeholder="Select sequency"
                  />
                </div>

                {/* <div>
                  <CustomDatalist
                    control={methods.control}
                    name="sequency"
                    label="Sequency"
                    data={SEQUENCY_OPTIONS}
                    className='max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94]'
                  />
                </div> */}
              </VStack>

              <VStack className="flex-1 space-y-6">
                <div>
                  <SelectField
                    data={currencyOptions}
                    control={methods.control}
                    fullWidth
                    name="currency"
                    label="Currency"
                    className="max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94] rounded-sm"
                    placeholder="Select currency"
                  />
                </div>

                <div>
                  <TextField
                    control={methods.control}
                    fullWidth
                    name="totalRounds"
                    label="Total Rounds"
                    className="max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94]"
                    placeholder="Enter number of round..."
                  />
                </div>
              </VStack>
            </HStack>

            <HStack className="justify-between items-baseline gap-20 space-y-6">
              <div className="flex-1">
                <DateTimePickerField
                  disablePast
                  control={methods.control}
                  fullWidth
                  name="startTime"
                  label="Start Time"
                  placeholder="DD/MM/YYYY"
                  className="max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94]"
                />
              </div>

              <div className="flex-1">
                <DateTimePickerField
                  disabled
                  disablePast
                  isDisabled={true}
                  control={methods.control}
                  fullWidth
                  name="endTime"
                  label="End Time"
                  placeholder="DD/MM/YYYY"
                  className="max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94]"
                />
              </div>
            </HStack>

            <HStack className="justify-between items-start gap-20 space-y-6">
              <VStack className="flex-1 mt-6">
                <p className="font-bold">% Prizes</p>

                <div>
                  <TextField
                    control={methods.control}
                    fullWidth
                    name="match1"
                    label="Match first 1"
                    className="max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94]"
                    suffix={'%'}
                    placeholder="0"
                  />
                </div>

                <div>
                  <TextField
                    control={methods.control}
                    fullWidth
                    name="match2"
                    label="Match first 2"
                    className="max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94]"
                    suffix={'%'}
                    placeholder="0"
                  />
                </div>

                <div>
                  <TextField
                    control={methods.control}
                    fullWidth
                    name="match3"
                    label="Match first 3"
                    className="max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94]"
                    suffix={'%'}
                    placeholder="0"
                  />
                </div>

                <div>
                  <TextField
                    control={methods.control}
                    fullWidth
                    name="match4"
                    label="Match first 4"
                    className="max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94]"
                    suffix={'%'}
                    placeholder="0"
                  />
                </div>
              </VStack>

              <VStack className="flex-1">
                <div className="flex-1 opacity-0">label</div>

                <TextField
                  control={methods.control}
                  fullWidth
                  name="ticketPrice"
                  label="Ticket Price"
                  className="max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94]"
                  placeholder="0"
                />
              </VStack>
            </HStack>

            <HStack className="w-full justify-end gap-6 mt-20">
              <Button
                onClick={() => route.back()}
                variant="outline"
                className="min-w-28 min-h-8 rounded-sm border text-[#8B8B94] border-[#8B8B94]"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                loading={isPendingCreate || loading}
                variant="default"
                className="min-w-28 min-h-8 rounded-sm"
                disabled={!connected}
              >
                Create
              </Button>
            </HStack>
          </VStack>
        </FormWrapper>
      </div>
    </VStack>
  );
};
