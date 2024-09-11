'use client';

import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { Icons } from '@/assets/icons';

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { FCC } from '@/types';
import { IGetPoolJoinedItem } from '@/apis/pools';
import { CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useCommonCarousel } from '@/hooks/useCommonCarousel';
import TicketDetailItem from './TicketDetailItem';
import { useDetailTicketStore } from '@/stores/DetailTicketStore';

type Props = {
  pool: IGetPoolJoinedItem;
  activeRound: number;
  setActiveRound: Dispatch<SetStateAction<number>>;
};

export const TicketDetailDrawer: FCC<Props> = ({ children, pool, activeRound, setActiveRound }) => {
  const [skipLoop, setSkipLoop] = React.useState(false);
  const store = useDetailTicketStore.use.store();
  const setStore = useDetailTicketStore.use.setStore();

  const { carouselRef, selectedIndex, onNextButtonClick } = useCommonCarousel();

  useEffect(() => {
    setActiveRound(selectedIndex);
    setSkipLoop(true);
  }, [selectedIndex, setActiveRound]);

  useEffect(() => {
    if (!skipLoop) {
      for (let i = 0; i < activeRound; i++) {
        onNextButtonClick();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRound, onNextButtonClick]);

  const handleClose = () => {
    setStore({
      ...store,
      poolId: undefined,
    });
  };

  return (
    <Drawer open={store?.poolId ? store?.poolId === pool?.id : false} onOpenChange={() => setSkipLoop(false)}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="w-full">
          <DrawerHeader className="flex justify-between container">
            <DrawerTitle className="text-white text-2xl font-semibold">Ticket Details</DrawerTitle>

            <button onClick={handleClose}>
              <Icons.x className="text-gray-color" />
            </button>
          </DrawerHeader>
          <div className="border-t-[1px] max-h-[70vh] h-fit overflow-auto border-t-gray-color pt-5 pb-10">
            <CarouselContent className="-ml-[3rem]" ref={carouselRef}>
              {pool?.rounds?.map((item, index) => {
                return (
                  <CarouselItem key={`${pool?.id || 0}-${index}`} className="pl-[3rem] basis-[100%]">
                    <TicketDetailItem pool={pool} roundActive={item} />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
