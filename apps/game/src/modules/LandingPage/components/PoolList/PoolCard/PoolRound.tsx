import React, { FC, memo } from 'react';
import { IGetPoolDetailRound } from '@/apis/pools';
import { format } from 'date-fns';

import { HStack } from '@/components/ui/Utilities';
import { AnimatePresence, motion } from 'framer-motion';
import { slideAnimation } from '@/modules/LandingPage/utils/const';
import Link from 'next/link';
import { Icons } from '@/assets/icons';

interface Props {
  rounds: IGetPoolDetailRound[];
  currentRound: number;
  date: string | undefined;
  isEndRound?: boolean;
}

const PoolRound: FC<Props> = ({ currentRound, date, isEndRound = false }) => {
  const roundShow = currentRound >= 10 ? currentRound : `0${currentRound}`;

  return (
    <div className="text-white px-5 py-4 min-h-20">
      <AnimatePresence mode="wait">
        <motion.div key={currentRound} {...slideAnimation}>
          <HStack pos={'apart'} spacing={12}>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Round</span>{' '}
                <span className="bg-navigate-tab px-3 py-1 rounded-lg h-8">{roundShow}</span>
              </div>

              <div className="text-xs">{!!date && `Draw ${format(new Date(date), 'MMM dd, yyyy, HH:mm a')}`}</div>
              {!!isEndRound && (
                <Link href={'#'} target="_blank" className="text-xs text-primary flex gap-2 items-center">
                  <span>Winning Ticket Block</span>

                  <Icons.newTab size={12} />
                </Link>
              )}
            </div>
          </HStack>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default memo(PoolRound);
