import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { RoundButton } from '../PoolCard/PoolRound';
import { Icons } from '@/assets/icons';
import { HStack, VStack } from '@/components/ui/Utilities';

const PoolCardSkeleton = () => {
  return (
    <div className="w-full rounded-xl overflow-hidden">
      <Skeleton className="rounded-none py-1.5 h-[4.25rem]" />

      <div className="border-x-navigate-tab border-x text-white px-5 py-4">
        <HStack pos={'apart'} spacing={12}>
          <div className="space-y-1">
            <HStack spacing={4}>
              <span className="font-medium">Round</span> <Skeleton className="h-8 w-10" />
            </HStack>

            <Skeleton className="h-3 w-[10rem]" />
          </div>

          <div className="space-x-5">
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
            <div className="text-center">Prize Pot</div>

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
