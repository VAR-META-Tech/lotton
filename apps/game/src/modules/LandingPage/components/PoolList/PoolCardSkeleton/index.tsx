import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { Icons } from '@/assets/icons';
import { HStack, VStack } from '@/components/ui/Utilities';
import { RoundButton } from '../PoolCard/RoundAction';

const PoolCardSkeleton = () => {
  return (
    <div className="w-full rounded-xl overflow-hidden relative">
      <Skeleton className="rounded-none py-1.5 h-[5.5rem]" />

      <div className="border-x-navigate-tab border-x text-white px-5 py-4">
        <HStack pos={'apart'} spacing={12}>
          <div className="space-y-1">
            <Skeleton className="h-8 w-[6rem]" />

            <Skeleton className="h-3 w-[10rem]" />
          </div>

          <div className="space-x-5 absolute top-[7.5rem] right-5 z-20">
            <RoundButton isDisabled={true}>
              <Icons.arrowLeft color="#fff" />
            </RoundButton>

            <RoundButton isDisabled={true}>
              <Icons.arrowRight color="#fff" />
            </RoundButton>
          </div>
        </HStack>
      </div>
      <div className="p-5 border border-navigate-tab h-[12.875rem]">
        <VStack align={'center'}>
          <div className="text-white space-y-2">
            <Skeleton className="text-center h-6 w-28 mx-auto" />

            <HStack pos={'center'} spacing={8}>
              <Skeleton className="h-[1.875rem] w-[1.875rem]" />

              <Skeleton className="h-[1.875rem] w-52" />
            </HStack>

            <Skeleton className="h-[1.875rem]" />
          </div>

          <Skeleton className="h-10" />
        </VStack>
      </div>

      <Skeleton className="h-12 rounded-none" />
    </div>
  );
};

export default PoolCardSkeleton;
