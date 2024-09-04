'use client';

import React, { useState } from 'react';

import { cn } from '@/lib/utils';
import { useCommonCarousel } from '@/hooks/useCommonCarousel';
import { useGetPools } from '@/hooks/useGetPools';
import { CarouselContent, CarouselItem } from '@/components/ui/carousel';

import PoolCard from './PoolCard';
import PoolCardSkeleton from './PoolCardSkeleton';
import PaginationSkeleton from './PoolCardSkeleton/PaginationSkeleton';
import Empty from '@/components/Empty';

const PoolList = () => {
  const [isShow, setIsShow] = useState(false);
  const { pools, isLoading } = useGetPools({
    // status: 'upcoming',
  });
  const { carouselRef, selectedIndex, scrollSnaps, onDotButtonClick } = useCommonCarousel();

  const renderPools = React.useCallback(() => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <PoolCardSkeleton />

          <PaginationSkeleton />
        </div>
      );
    }

    if (!pools?.length) {
      return <Empty />;
    }

    return (
      <CarouselContent className="-ml-[3rem]" ref={carouselRef}>
        {pools?.map((pool, index) => (
          <CarouselItem key={`${pool?.id || 0}-${index}`} className="pl-[3rem] basis-[100%]">
            <PoolCard isActive={index === selectedIndex} poolId={pool?.id || 0} isShow={isShow} setIsShow={setIsShow} />
          </CarouselItem>
        ))}
      </CarouselContent>
    );
  }, [carouselRef, isLoading, isShow, pools, selectedIndex]);

  const renderDots = React.useCallback(() => {
    if (isLoading) return null;

    return (
      <div className="flex justify-center gap-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label="dot"
            className={cn('h-2 w-3 rounded-full bg-[#ECEEF1]', {
              'bg-primary w-6': selectedIndex === index,
            })}
            onClick={() => onDotButtonClick(index)}
          />
        ))}
      </div>
    );
  }, [isLoading, onDotButtonClick, scrollSnaps, selectedIndex]);

  return (
    <div className="space-y-4">
      {renderPools()}

      {renderDots()}
    </div>
  );
};

export default PoolList;
