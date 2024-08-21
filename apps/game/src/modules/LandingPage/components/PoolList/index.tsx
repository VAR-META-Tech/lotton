'use client';

import React, { useState } from 'react';

import { cn } from '@/lib/utils';
import { useCommonCarousel } from '@/hooks/useCommonCarousel';
import { CarouselContent, CarouselItem } from '@/components/ui/carousel';

import PoolCard from './PoolCard';

const PoolList = () => {
  const [isShow, setIsShow] = useState(false);

  const { carouselRef, selectedIndex, scrollSnaps, onDotButtonClick } = useCommonCarousel();

  return (
    <div className="space-y-4">
      <CarouselContent className="-ml-[3rem] py-3" ref={carouselRef}>
        <CarouselItem className="pl-[3rem] basis-[100%]">
          <PoolCard isShow={isShow} setIsShow={setIsShow} />
        </CarouselItem>
        <CarouselItem className="pl-[3rem] basis-[100%]">
          <PoolCard isShow={isShow} setIsShow={setIsShow} />
        </CarouselItem>
        <CarouselItem className="pl-[3rem] basis-[100%]">
          <PoolCard isShow={isShow} setIsShow={setIsShow} />
        </CarouselItem>
      </CarouselContent>

      <div className="flex justify-center gap-2">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            aria-label="dot"
            className={cn('h-2 w-3 rounded-full bg-[#ECEEF1]', {
              'bg-primary w-6': selectedIndex === index,
            })}
            onClick={() => onDotButtonClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default PoolList;

type PropType = React.PropsWithChildren<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
>;

export const DotButton: React.FC<PropType> = (props) => {
  const { children, ...restProps } = props;

  return (
    <button type="button" {...restProps}>
      {children}
    </button>
  );
};
