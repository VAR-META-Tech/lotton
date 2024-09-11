import { memo, useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { HStack } from '@/components/ui/Utilities';
import { AnimatePresence, motion } from 'framer-motion';

import { IGetPoolJoinedItem, IGetPoolJoinedItemRound } from '@/apis/pools';
import { Carousel } from '@/components/ui/carousel';
import { useGetPoolDetail } from '@/hooks/useGetPoolDetail';
import { getRoundActiveNumber } from '@/lib/common';
import BuyTicketDrawer from '@/modules/LandingPage/components/PoolList/BuyTicketDrawer';
import { ChangeRoundAction } from './ChangeRoundAction';
import { DrawTime } from './DrawTime';
import { TicketDetailDrawer } from './TicketDetailDrawer';

type Props = {
  pool: IGetPoolJoinedItem;
};

export const PoolItem = ({ pool }: Props) => {
  const [activeRound, setActiveRound] = useState<number>(0);

  const { pool: poolDetail, rounds: roundsDetail } = useGetPoolDetail({
    isActive: true,
    poolId: pool?.id || 0,
  });

  // pool joined
  const rounds = pool?.rounds || [];
  const roundActive = rounds[activeRound];

  // pool detail
  const roundDetailActive = roundsDetail[activeRound];
  const totalTickets = roundActive?.totalTicket ?? 0;

  const handleChangeRoundActive = useCallback(
    (upRound: boolean) => {
      if (upRound) {
        if (activeRound + 1 >= rounds.length) return;
        setActiveRound(activeRound + 1);
      } else {
        if (activeRound - 1 < 0) return;
        setActiveRound(activeRound - 1);
      }
    },
    [activeRound, rounds.length]
  );

  return (
    <div className="shadow-lg w-full grid grid-cols-6 relative">
      <div className="bg-primary col-span-6 py-1 px-4">
        <div className="font-semibold text-black text-lg">{pool?.name || ''}</div>
      </div>

      <div className="absolute right-4 top-12">
        <ChangeRoundAction activeRound={activeRound} onClick={handleChangeRoundActive} rounds={rounds} />
      </div>

      <div className="bg-background col-span-6 p-4 border border-t-0 border-primary flex flex-col gap-4 items-center">
        <motion.div
          className="flex flex-col gap-4 items-center"
          key={activeRound}
          initial={{ x: '-10%', opacity: 0.5 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '10%', opacity: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <RoundNumber roundActive={roundActive} />

          <DrawTime endTime={Number(roundActive?.endTime || 0)} />

          <p className="text-sm">
            You bought {totalTickets} {totalTickets > 1 ? 'tickets' : 'ticket'}
          </p>
        </motion.div>

        <Carousel>
          <TicketDetailDrawer pool={pool} activeRound={activeRound} setActiveRound={setActiveRound}>
            <Button className="mx-auto rounded-lg text-white">View your tickets</Button>
          </TicketDetailDrawer>
        </Carousel>
      </div>

      <BuyTicketDrawer pool={poolDetail} roundActive={roundDetailActive} />
    </div>
  );
};

const RoundNumber = ({ roundActive }: { roundActive: IGetPoolJoinedItemRound }) => {
  const roundActiveNumber = getRoundActiveNumber(roundActive?.roundNumber || 0);

  return (
    <HStack spacing={16}>
      <span className="font-medium">Round</span>

      <div>
        <HStack
          pos={'center'}
          align={'center'}
          className="min-w-[2.9375rem] text-center h-[1.75rem] bg-background-2 rounded-md"
        >
          {roundActiveNumber}
        </HStack>
      </div>
    </HStack>
  );
};
