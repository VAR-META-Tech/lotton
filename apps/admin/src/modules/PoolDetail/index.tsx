'use client';

import { HStack, VStack } from "@/components/ui/Utilities";
import FormWrapper from '@/components/ui/FormWrapper';
import { TextField } from '@/components/ui/FormField';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { poolDetailSchema, PoolDetailSchema } from './components/types';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useGetPoolDetail } from '@/apis/pool';
import { useEffect } from 'react';
import { DatePickerField } from '@/components/ui/FormField/DatePickerField';
import { convertToTimestamp } from '@/lib/utils';
import dayjs from 'dayjs';

export const PoolDetail = () => {
  const route = useRouter();
  const { id } = useParams();
  const { data: poolDetail } = useGetPoolDetail(String(id),
    { queryKey: ['/pool/detail', id], enabled: !!id }
  );

  const methods = useForm<PoolDetailSchema>({
    resolver: zodResolver(poolDetailSchema),
  });

  const handleSubmit = () => {}
  
  useEffect(() => {
    const now = new Date().getTime();

    methods.reset({
      name: poolDetail?.data?.name,
      sequency: poolDetail?.data?.sequency || 0,
      currency: poolDetail?.data?.currency?.name || 'N/A',
      totalRound: poolDetail?.data?.totalRounds || 0,
      upcomingRound: poolDetail?.data?.rounds?.filter((round) => convertToTimestamp(round.startTime) > now).length, 
      startTime: dayjs(poolDetail?.data?.startTime),
      endTime: dayjs(poolDetail?.data?.endTime),
      match1: poolDetail?.data?.poolPrizes[0]?.allocation || 0,
      match2: poolDetail?.data?.poolPrizes[1]?.allocation || 0,
      match3: poolDetail?.data?.poolPrizes[2]?.allocation || 0,
      match4: poolDetail?.data?.poolPrizes[3]?.allocation || 0,
    })
  }, [poolDetail])

  return (
    <VStack className="mx-10 mb-24 bg-white rounded-sm min-h-[12.5rem] px-24 py-12">
      <div>
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
                    disabled
                  />
                </div>

                <div>
                  <TextField
                    control={methods.control}
                    fullWidth
                    name="sequency"
                    label="Sequency"
                    className='max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94]'
                    disabled
                  />
                </div>
              </VStack>

              <VStack className='flex-1 space-y-6'>
                <div>
                  <TextField
                    control={methods.control}
                    fullWidth
                    name="currency"
                    label="Currency"
                    className='max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94]'
                    disabled
                  />
                </div>

                <div>
                  <TextField
                    control={methods.control}
                    fullWidth
                    name="totalRound"
                    label="Total Round"
                    className='max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94]'
                    disabled
                  />
                </div>

                <div>
                  <TextField
                    control={methods.control}
                    fullWidth
                    name="upcomingRound"
                    label="Upcoming Round"
                    className='max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94]'
                    disabled
                  />
                </div>
              </VStack>
            </HStack>

            <HStack className='justify-between items-end gap-20 space-y-6'>
              <div className='flex-1'>
                <DatePickerField
                  disablePast
                  isDisabled={true}
                  control={methods.control}
                  fullWidth
                  name="startTime"
                  label="Start Time"
                  placeholder="DD/MM/YYYY HH:mm:ss"
                  className='max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94]'
                />
              </div>

              <div className='flex-1'>
                <DatePickerField
                  disablePast
                  isDisabled={true}
                  control={methods.control}
                  fullWidth
                  name="endTime"
                  label="End Time"
                  placeholder="DD/MM/YYYY HH:mm:ss"
                  className='max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94]'
                />
              </div>
            </HStack>

            <VStack className='w-[46%] mt-6'>
              <p className='font-bold'>% Prizes</p>

              <div>
                <TextField
                  control={methods.control}
                  fullWidth
                  name="match1"
                  label="Match first 1"
                  className='max-h-[2.125rem] bg-[#ECEEF1] border-[#8B8B94]'
                  disabled
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
                  disabled
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
                  disabled
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
                  disabled
                  suffix={'%'}
                />
              </div>
            </VStack>

            <HStack className="w-full justify-end gap-6 mt-20">
              <Button onClick={() => route.back()} variant="outline" className="min-w-28 min-h-8 rounded-sm border text-[#8B8B94] border-[#8B8B94]">
                Cancel
              </Button>

              {/* <Button
                type="button"
                variant="default"
                className="min-w-28 min-h-8 rounded-sm"
                disabled
              >
                Edit
              </Button> */}
            </HStack>
          </VStack>
        </FormWrapper>
      </div>
    </VStack>
  );
};
