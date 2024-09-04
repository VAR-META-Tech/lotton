import React, { FC, useMemo } from 'react';
import Image from 'next/image';

import { prettyNumber } from '@/lib/common';
import { HStack, VStack } from '@/components/ui/Utilities';

import PoolAction from './PoolAction';
import { AnimatePresence, motion } from 'framer-motion';
import { slideAnimation } from '@/modules/LandingPage/utils/const';
import WinningNumber from '@/modules/CheckPage/components/CheckPrizeDrawer/CheckPrize/WinningNumber';
import UserTicketCount from './UserTicketCount';
import { IGetPoolDetailCurrency } from '@/apis/pools';

interface Props {
  currentRound: string;
  isEndRound?: boolean;
  poolId: number;
  roundId: number;
  currency: IGetPoolDetailCurrency | undefined;
  roundIdOnChain: number;
  poolIdOnChain: number;
  winCode: string;
}

const PoolPrizePot: FC<Props> = ({
  currentRound,
  isEndRound = false,
  poolId,
  roundId,
  currency,
  poolIdOnChain,
  roundIdOnChain,
  winCode,
}) => {
  const prizePot = useMemo(() => {
    return (
      <div className="p-5 border-y border-y-navigate-tab min-h-[12.875rem]">
        <AnimatePresence mode="wait">
          <motion.div key={currentRound} {...slideAnimation}>
            <VStack align={'center'}>
              <div className="text-white">
                <div className="text-center">Prize Pot</div>

                <HStack pos={'center'} spacing={8}>
                  <Image src={'/images/tokens/ton_symbol.webp'} width={30} height={30} alt="ton" />
                  <span className="text-primary text-2xl font-semibold">{`${prettyNumber(2500)} ${
                    currency?.symbol || ''
                  }`}</span>
                </HStack>

                <div className="text-xs text-gray-color text-center">{`~ ${prettyNumber(10000)} USD`}</div>
              </div>

              <PoolAction
                holdingTicket={0}
                poolId={poolId || 0}
                roundId={roundId}
                roundIdOnChain={roundIdOnChain}
                poolIdOnChain={poolIdOnChain}
              />
            </VStack>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }, [currency?.symbol, currentRound, poolId, poolIdOnChain, roundId, roundIdOnChain]);

  const prizePotWinningNumber = useMemo(() => {
    return (
      <VStack className="min-h-[11.375rem] border-t border-t-navigate-tab">
        <AnimatePresence mode="wait">
          <motion.div key={currentRound} {...slideAnimation} className="flex-1 flex flex-col">
            <VStack spacing={0} justify={'between'} className="flex-1">
              <WinningNumber code={winCode} titleClassName="mx-auto" spacing={12} className="py-2" />

              <div className="border-y border-y-navigate-tab py-4">
                <UserTicketCount />
              </div>
            </VStack>
          </motion.div>
        </AnimatePresence>
      </VStack>
    );
  }, [currentRound, winCode]);

  const renderContent = useMemo(() => {
    if (!isEndRound) {
      return prizePot;
    }

    return prizePotWinningNumber;
  }, [isEndRound, prizePot, prizePotWinningNumber]);

  return <>{renderContent}</>;
};

export default PoolPrizePot;
