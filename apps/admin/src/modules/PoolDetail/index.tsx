'use client';

import { useEffect, useMemo, useState, MouseEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetPoolDetail, useGetTokens } from '@/apis/pool';
import { useDeletePool, useUpdatePool } from '@/apis/pool/mutations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { ROUTES } from '@/lib/routes';
import { cn, convertToTimestamp } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { SelectField, TextField } from '@/components/ui/FormField';
import { DatePickerField } from '@/components/ui/FormField/DatePickerField';
import FormWrapper from '@/components/ui/FormWrapper';
import { HStack, Show, VStack } from '@/components/ui/Utilities';

import { DateTimePickerField } from '@/components/ui/FormField/DateTimePickerField';
import { SEQUENCY_OPTIONS } from '../PoolManagement/CreatePool';
import { Minus, Plus } from 'lucide-react';
import { poolSchema, PoolSchema } from '../PoolManagement/components/types';

export const PoolDetail = () => {
  const route = useRouter();
  const { id } = useParams();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [qtyRound, setQtyRound] = useState<number>(0)

  const { data: poolDetail } = useGetPoolDetail(String(id), { queryKey: ['/pool/detail', id], enabled: !!id });

  const methods = useForm<PoolSchema>({
    resolver: zodResolver(poolSchema),
  });

  const { mutate: deletePoolMutate } = useDeletePool();

  const { mutate: updatePoolMutate, isPending: isPendingUpdate } = useUpdatePool();

  const { data: tokenList } = useGetTokens({});

  const currencyOptions = useMemo(() => {
    if (!tokenList) return [];
    return tokenList?.data?.items.map((token) => ({
      label: token.name,
      value: String(token.id),
    }));
  }, [tokenList]);

  const handleSubmit = (values: PoolSchema) => {
    updatePoolMutate({
      poolId: Number(id),
      payload: {
        name: values.name,
        currency: Number(values.currency),
        sequency: Number(values.sequency),
        totalRounds: Number(values.totalRounds) + qtyRound,
        startTime: new Date(values.startTime).toISOString(),
        ticketPrice: Number(values.ticketPrice),
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
      }
    }, {
      onSuccess: () => {
        route.push(ROUTES.POOL);
        toast.success('Update pool successful');
      },
      onError: (error) => {
        toast.error(`${error.message}`);
      },
    })
  };

  const handleDeletePool = () => {
    deletePoolMutate(Number(id), {
      onSuccess: () => {
        route.push(ROUTES.POOL);
        toast.success('Delete pool successful');
      },
      onError: (error) => {
        toast.error(`${error.message}`);
      },
    });
  };

  const isStart = useMemo(() => {
    if (!poolDetail?.data?.startTime) return;
    const now = new Date().getTime();
    const timeStamp = convertToTimestamp(poolDetail?.data?.startTime);

    return now > timeStamp
  }, [poolDetail?.data?.startTime])

  useEffect(() => {
    if (!poolDetail?.data) return;
    const now = new Date().getTime();

    methods.reset({
      name: poolDetail?.data?.name,
      sequency: String(poolDetail?.data?.sequency),
      currency: String(poolDetail?.data?.currency?.id) || 'N/A',
      totalRounds: String(poolDetail?.data?.totalRounds) || '0',
      upcomingRound: String(poolDetail?.data?.rounds?.filter((round) => convertToTimestamp(round.startTime) > now).length),
      ticketPrice: String(poolDetail?.data?.ticketPrice),
      startTime: new Date(poolDetail?.data?.startTime ?? ''),
      endTime: new Date(poolDetail?.data?.endTime ?? ''),
      match1: String(poolDetail?.data?.poolPrizes[0]?.allocation) || '0',
      match2: String(poolDetail?.data?.poolPrizes[1]?.allocation) || '0',
      match3: String(poolDetail?.data?.poolPrizes[2]?.allocation) || '0',
      match4: String(poolDetail?.data?.poolPrizes[3]?.allocation) || '0',
    });

    setQtyRound(0);
  }, [poolDetail, isEdit]);

  const startTime = methods.watch('startTime');
  const sequency = methods.watch('sequency');
  const totalRound = methods.watch('totalRounds');

  useEffect(() => {
    if (!isEdit || !startTime || !sequency || !totalRound) return;

    const sequencyNum = Number(sequency);
    const totalRoundNum = Number(totalRound);
  
    if (isNaN(sequencyNum) || isNaN(totalRoundNum)) return;

    const startDate = new Date(startTime);

    startDate.setDate(startDate.getDate() + (sequencyNum * Number(totalRoundNum)));
  
    methods.setValue('endTime', startDate);
  }, [startTime, sequency, totalRound]);

  const handleSave = async (e: MouseEvent<HTMLButtonElement>) => {
    await methods.trigger();
    if (!methods.formState.isValid) {
      e.preventDefault();
    } 
  }

  const handleMinus = () => {
    setQtyRound(qtyRound - 1);
  }

  const handlePlus = () => {
    setQtyRound(qtyRound + 1);
  }

  return (
    <VStack className="mx-10 mb-24 bg-white rounded-sm min-h-[12.5rem] px-24 py-12">
      <FormWrapper methods={methods} onSubmit={handleSubmit}>
        <VStack>
          <HStack className='justify-between items-start gap-20'>
            <VStack className='flex-1 space-y-6'>
              <div>
                <TextField
                  control={methods.control}
                  fullWidth
                  name="name"
                  label="Pool Name"
                  className='max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94]'
                  disabled={!isEdit || isStart}
                />
              </div>

              <div>
                <SelectField
                  control={methods.control}
                  data={SEQUENCY_OPTIONS}
                  fullWidth
                  name="sequency"
                  label="Sequency"
                  className="max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94] rounded-sm"
                  placeholder="Select sequency"
                  disabled={!isEdit || isStart}
                />
              </div>
            </VStack>

            <VStack className='flex-1 space-y-6'>
              <div>
                <SelectField
                  control={methods.control}
                  data={currencyOptions}
                  fullWidth
                  name="currency"
                  label="Currency"
                  className="max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94] rounded-sm"
                  placeholder="Select currency"
                  disabled={!isEdit || isStart}
                />
              </div>

              <div>
                <TextField
                  control={methods.control}
                  fullWidth
                  name="totalRounds"
                  label="Total Rounds"
                  className='max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94]'
                  disabled={!isEdit || isStart}
                />
              </div>

              <HStack className={cn('w-full items-end gap-6')}>
                <Show when={!isEdit || (isStart && isEdit)}>
                  <div className='flex-1'>
                    <TextField
                      control={methods.control}
                      fullWidth
                      name="upcomingRound"
                      label="Upcoming Round"
                      className={cn('max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94]')}
                      disabled={!isEdit || isStart}
                    />
                  </div>
                </Show>

                <Show when={isEdit && isStart}>
                  <div className='flex-1 flex gap-4 items-center '>
                    <Button size={'sm'} variant="outline" onClick={handleMinus} disabled={qtyRound <= 0}>
                      <Minus />
                    </Button>

                    <p>{qtyRound}</p>

                    <Button size={'sm'} variant="outline" onClick={handlePlus}>
                      <Plus />
                    </Button>
                  </div>
                </Show>
              </HStack>
            </VStack>
          </HStack>

          <HStack className='justify-between items-end gap-20 space-y-6'>
            <div className="flex-1">
              <DateTimePickerField
                disablePast
                control={methods.control}
                fullWidth
                name="startTime"
                label="Start Time"
                placeholder="DD/MM/YYYY"
                className="max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94]"
                disabled={!isEdit || isStart}
              />
            </div>

            <div className='flex-1'>
              <DatePickerField
                disablePast
                isDisabled
                control={methods.control}
                fullWidth
                name="endTime"
                label="End Time"
                placeholder="DD/MM/YYYY HH:mm:ss"
                className='max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94]'
              />
            </div>
          </HStack>

          <HStack className="justify-between items-start gap-20 space-y-6">
            <VStack className="flex-1 mt-6">
              <p className='font-bold'>% Prizes</p>

              <div>
                <TextField
                  control={methods.control}
                  fullWidth
                  name="match1"
                  label="Match first 1"
                  className='max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94]'
                  disabled={!isEdit || isStart}
                  suffix={'%'}
                />
              </div>

              <div>
                <TextField
                  control={methods.control}
                  fullWidth
                  name="match2"
                  label="Match first 2"
                  className='max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94]'
                  disabled={!isEdit || isStart}
                  suffix={'%'}
                />
              </div>

              <div>
                <TextField
                  control={methods.control}
                  fullWidth
                  name="match3"
                  label="Match first 3"
                  className='max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94]'
                  disabled={!isEdit || isStart}
                  suffix={'%'}
                />
              </div>

              <div>
                <TextField
                  control={methods.control}
                  fullWidth
                  name="match4"
                  label="Match first 4"
                  className='max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94]'
                  disabled={!isEdit || isStart}
                  suffix={'%'}
                />
              </div>
            </VStack>

            <VStack className="flex-1">
              <div className="flex-1 opacity-0">label</div>

              <Show when={isEdit && !isStart}>
                <TextField
                  control={methods.control}
                  fullWidth
                  name="ticketPrice"
                  label="Ticket Price"
                  className="max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94]"
                  placeholder="0"
                />
              </Show>
            </VStack>
          </HStack>

          <Show when={!isEdit}>
            <HStack className='w-full justify-end gap-6 mt-20'>
              <Button
                type="button"
                onClick={() => route.back()}
                variant="outline"
                className='min-w-28 min-h-8 rounded-sm border text-[#8B8B94] border-[#8B8B94]'
              >
                Cancel
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" className="min-w-28 min-h-8 rounded-sm text-white bg-[#E85858]">
                    Delete
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent className='!rounded-sm'>
                  <AlertDialogTitle className='text-center text-2xl'>Confirm Delete</AlertDialogTitle>
                  <AlertDialogDescription className='space-y-6 text-black my-6 text-base'>
                    <p>Are you sure you want to delete this pool? Deleting this pool will permanently
                    remove it and all associated data.</p>
                    
                    <p>This action  cannot be undone.</p>
                  </AlertDialogDescription>
                  <AlertDialogFooter className='gap-4'>
                    <AlertDialogCancel className='min-w-28 min-h-4 rounded-sm border text-[#8B8B94] border-[#8B8B94]'>Discard</AlertDialogCancel>
                    <AlertDialogAction
                      className='min-w-28 min-h-4 rounded-sm text-white bg-[#81A95D]'
                      onClick={handleDeletePool}
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                type="button"
                className="min-w-28 min-h-8 rounded-sm bg-black"
                onClick={() => setIsEdit(true)}
              >
                Edit
              </Button>
            </HStack>
          </Show>

          <Show when={isEdit}>
            <HStack className='w-full justify-end gap-6 mt-20'>
              <Button
                type="button"
                onClick={() => setIsEdit(false)}
                variant="outline"
                className='min-w-28 min-h-8 rounded-sm border text-[#8B8B94] border-[#8B8B94]'
              >
                Discard
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    className="min-w-28 min-h-8 rounded-sm bg-[#81A95D]"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent className='!rounded-sm'>
                  <AlertDialogTitle className='text-center text-2xl'>Confirm Updated</AlertDialogTitle>
                  <AlertDialogDescription className='space-y-2 text-black my-6 text-base'>
                    <p>{isStart
                      ? `The number of rounds for this pool has been changed to ${Number(poolDetail?.data?.totalRounds) + qtyRound} rounds.`
                      : `Are you sure you want to update this pool? Updating this pool will permanently update it and all associated data.`}
                    </p>
                    
                    <ol className='list-disc pl-10 whitespace-nowrap'>
                      <li><span className='font-bold'>Important:</span> This change will affect all participants.</li>
                      <li><span className='font-bold'>Note:</span> Any existing rounds will remain unaffected.</li>
                    </ol>

                    <p className='pt-6'>Please ensure that you are aware of this change.</p>
                  </AlertDialogDescription>
                  <AlertDialogFooter className='gap-4'>
                    <AlertDialogCancel className='min-w-28 min-h-4 rounded-sm border text-[#8B8B94] border-[#8B8B94]'>Discard</AlertDialogCancel>
                    <Button
                      className='min-w-28 min-h-4 rounded-sm text-white bg-[#81A95D]'
                      type='submit'
                      onClick={methods.handleSubmit(handleSubmit)}
                      loading={isPendingUpdate}
                    >
                      Confirm
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </HStack>
          </Show>
        </VStack>
      </FormWrapper>
    </VStack>
  );
};
