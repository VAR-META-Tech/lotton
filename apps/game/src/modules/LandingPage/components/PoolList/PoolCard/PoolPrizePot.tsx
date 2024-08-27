import React, { FC, useMemo } from 'react';
import Image from 'next/image';

import { prettyNumber } from '@/lib/common';
import { HStack, VStack } from '@/components/ui/Utilities';

import PoolAction from './PoolAction';
import { AnimatePresence, motion } from 'framer-motion';
import { slideAnimation } from '@/modules/LandingPage/utils/const';
import WinningNumber from '@/modules/CheckPage/components/CheckPrizeDrawer/WinningNumber';
import UserTicketCount from './UserTicketCount';

interface Props {
  ticketPrice: number;
  currentRound: number;
  isEndRound?: boolean;
}

const PoolPrizePot: FC<Props> = ({ ticketPrice, currentRound, isEndRound = false }) => {
  const renderContent = useMemo(() => {
    if (!isEndRound) {
      return (
        <div className="p-5 border-y border-y-navigate-tab min-h-[12.875rem]">
          <AnimatePresence mode="wait">
            <motion.div key={currentRound} {...slideAnimation}>
              <VStack align={'center'}>
                <div className="text-white">
                  <div className="text-center">Prize Pot</div>

                  <HStack pos={'center'} spacing={8}>
                    <Image src={'/images/tokens/ton_symbol.webp'} width={30} height={30} alt="ton" />
                    <span className="text-primary text-2xl font-semibold">{`${prettyNumber(2500)} TON`}</span>
                  </HStack>

                  <div className="text-xs text-gray-color text-center">{`~ ${prettyNumber(10000)} USD`}</div>
                </div>

                <PoolAction holdingTicket={0} ticketPrice={ticketPrice} />
              </VStack>
            </motion.div>
          </AnimatePresence>
        </div>
      );
    }

    return (
      <VStack spacing={0} justify={'between'} className="min-h-[12.875rem] border-t border-t-navigate-tab">
        <div className="px-5"></div>
        <WinningNumber code="b2a5" titleClassName="mx-auto" spacing={12} className="py-5" />

        <div className="border-y border-y-navigate-tab py-4">
          <UserTicketCount />
        </div>
      </VStack>
    );
  }, [currentRound, isEndRound, ticketPrice]);

  return <>{renderContent}</>;
};

export default PoolPrizePot;
