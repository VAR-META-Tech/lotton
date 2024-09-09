import React, { FC, memo } from 'react';
import { IGetPoolDetailRound } from '@/apis/pools';
import { format } from 'date-fns';

import { HStack } from '@/components/ui/Utilities';
import { AnimatePresence, motion } from 'framer-motion';
import { slideAnimation } from '@/modules/LandingPage/utils/const';
import Link from 'next/link';
import { Icons } from '@/assets/icons';
import { getRoundActiveNumber } from '@/lib/common';

interface Props {
  rounds: IGetPoolDetailRound[];
  roundActive: IGetPoolDetailRound;
  isEndRound?: boolean;
}

const PoolRound: FC<Props> = ({ roundActive, isEndRound = false }) => {
  const roundActiveNumber = getRoundActiveNumber(roundActive?.roundNumber);
  const endTime = Number(roundActive?.endTime || 0);

  return (
    <div className="text-white px-5 py-4 min-h-20">
      <AnimatePresence mode="wait">
        <motion.div key={roundActiveNumber} {...slideAnimation}>
          <HStack pos={'apart'} spacing={12}>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Round</span>{' '}
                <span className="bg-navigate-tab px-3 py-1 rounded-lg h-8">{roundActiveNumber}</span>
              </div>

              <div className="text-xs">
                {!!endTime && `Draw ${format(new Date(endTime * 1000), 'MMM dd, yyyy, HH:mm a')}`}
              </div>

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
