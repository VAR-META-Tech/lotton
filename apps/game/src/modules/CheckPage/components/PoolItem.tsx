import { useState } from 'react';
import { motion } from 'framer-motion';

import { useGetPoolDetail } from '@/hooks/useGetPoolDetail';
import { Button } from '@/components/ui/button';
import { HStack } from '@/components/ui/Utilities';

import { ChangeRoundAction } from './ChangeRoundAction';
import { DrawTime } from './DrawTime';
import { TicketDetailDrawer } from './TicketDetailDrawer';

type Props = {
  poolName: string;
  poolId: number;
};

export const PoolItem = ({ poolName, poolId }: Props) => {
  const [activeRound, setActiveRound] = useState(0);
  const { rounds } = useGetPoolDetail({ poolId, isActive: true });
  const roundActive = rounds[activeRound];
  const roundActiveNumber = roundActive
    ? `${roundActive.roundNumber < 10 ? `0${roundActive.roundNumber}` : roundActive.roundNumber}`
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
        <div className="font-semibold text-primary text-[1.625rem] text-center">{poolName}</div>
      </div>

      <div className="col-span-4 p-4 flex flex-col gap-4">
        <HStack pos={'apart'} spacing={16}>
          <RoundNumber roundNumber={roundActiveNumber} />

          <ChangeRoundAction activeRound={activeRound} onClick={handleChangeRoundActive} poolId={poolId} />
        </HStack>

        <DrawTime endTime={roundActive?.endTime} />

        <TicketDetailDrawer name={poolName} activeRound={activeRound + 1}>
          <Button className="mx-auto rounded-lg text-white">View your tickets</Button>
        </TicketDetailDrawer>
      </div>
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
