import { useState } from 'react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { HStack } from '@/components/ui/Utilities';

import { ChangeRoundAction } from './ChangeRoundAction';
import { DrawTime } from './DrawTime';
import { TicketDetailDrawer } from './TicketDetailDrawer';
import { IGetPoolJoinedItem } from '@/apis/pools';
import BuyTicketDrawer from '@/modules/LandingPage/components/PoolList/BuyTicketDrawer';

type Props = {
  pool: IGetPoolJoinedItem;
};

export const PoolItem = ({ pool }: Props) => {
  const [activeRound, setActiveRound] = useState(0);
  const rounds = pool?.rounds || [];
  const roundActive = rounds[activeRound];
  const roundActiveNumber = roundActive?.roundNumber;

  const roundActiveNumberLabel = roundActive
    ? `${roundActiveNumber < 10 ? `0${roundActiveNumber}` : roundActiveNumber}`
    : '00';

  const handleChangeRoundActive = (upRound: boolean) => {
    if (upRound) {
      if (activeRound + 1 >= rounds.length) return;
      setActiveRound(activeRound + 1);
    } else {
      if (activeRound - 1 < 0) return;
      setActiveRound(activeRound - 1);
    }
  };

  return (
    <div className="shadow-lg border w-full max-w-lg grid grid-cols-6">
      <div className="bg-background-2 col-span-2 border flex items-center justify-center p-4">
        <div className="font-semibold text-primary text-[1.625rem] text-center">{pool?.name || ''}</div>
      </div>

      <div className="col-span-4 p-4 flex flex-col gap-4">
        <HStack pos={'apart'} spacing={16}>
          <RoundNumber roundNumber={roundActiveNumberLabel} />

          <ChangeRoundAction activeRound={activeRound} onClick={handleChangeRoundActive} rounds={rounds} />
        </HStack>

        <DrawTime endTime={roundActive?.endTime} />

        <TicketDetailDrawer pool={pool} roundActiveNumber={roundActiveNumber}>
          <Button className="mx-auto rounded-lg text-white">View your tickets</Button>
        </TicketDetailDrawer>
      </div>

      <BuyTicketDrawer
        poolId={pool?.id}
        roundId={roundActive?.id}
        roundIdOnChain={roundActive?.roundIdOnChain}
        poolIdOnChain={pool?.poolIdOnChain}
      />
    </div>
  );
};

const RoundNumber = ({ roundNumber }: { roundNumber: string }) => (
  <HStack spacing={16}>
    <span className="font-medium">Round</span>

    <motion.div
      key={roundNumber}
      initial={{ x: '-10%', opacity: 0.5 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '10%', opacity: 0 }}
    >
      <HStack
        pos={'center'}
        align={'center'}
        className="min-w-[2.9375rem] text-center h-[1.75rem] bg-background-2 rounded-md"
      >
        {roundNumber}
      </HStack>
    </motion.div>
  </HStack>
);
