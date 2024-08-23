'use client';

import React, { useState } from 'react';

import { cn } from '@/lib/utils';
import { useCommonCarousel } from '@/hooks/useCommonCarousel';
import { useGetPools } from '@/hooks/useGetPools';
import { CarouselContent, CarouselItem } from '@/components/ui/carousel';

import PoolCard from './PoolCard';

const PoolList = () => {
  const [isShow, setIsShow] = useState(false);
  const { pools } = useGetPools();
  const { carouselRef, selectedIndex, scrollSnaps, onDotButtonClick } = useCommonCarousel();

  const renderPools = React.useCallback(() => {
    return (
      <CarouselContent className="-ml-[3rem] py-3" ref={carouselRef}>
        {pools?.map((pool, index) => (
          <CarouselItem key={`${pool?.id}-${index}`} className="pl-[3rem] basis-[100%]">
            <PoolCard isActive={index === selectedIndex} poolId={pool?.id} isShow={isShow} setIsShow={setIsShow} />
          </CarouselItem>
        ))}
      </CarouselContent>
    );
  }, [carouselRef, isShow, pools, selectedIndex]);

  const renderDots = React.useCallback(() => {
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
  }, [onDotButtonClick, scrollSnaps, selectedIndex]);

  return (
    <div className="space-y-4">
      {renderPools()}

      {renderDots()}
    </div>
  );
};

export default PoolList;
