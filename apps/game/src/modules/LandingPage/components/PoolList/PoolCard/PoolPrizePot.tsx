import React, { FC, useMemo } from 'react';
import Image from 'next/image';

import { getRoundActiveNumber, prettyNumber, roundNumber } from '@/lib/common';
import { HStack, VStack } from '@/components/ui/Utilities';

import PoolAction from './PoolAction';
import { AnimatePresence, motion } from 'framer-motion';
import { slideAnimation } from '@/modules/LandingPage/utils/const';
import WinningNumber from '@/modules/CheckPage/components/CheckPrizeDrawer/CheckPrize/WinningNumber';
import UserTicketCount from './UserTicketCount';
import { IGetPoolDetailData, IGetPoolDetailRound } from '@/apis/pools';
import { fromNano } from '@ton/core';
import { useGetTotalTickets } from '@/hooks/useGetTotalTickets';
import { useGetTokenPrice } from '@/hooks/useGetTokenPrice';

interface Props {
  pool: IGetPoolDetailData | undefined;
  roundActive: IGetPoolDetailRound;
  isEndRound?: boolean;
  isBeforeRoundEnd: boolean;
}

const PoolPrizePot: FC<Props> = ({ pool, roundActive, isEndRound = false, isBeforeRoundEnd }) => {
  const roundActiveNumber = getRoundActiveNumber(roundActive?.roundNumber);
  const currency = pool?.currency;
  const tokenSymbol = currency?.symbol || '';

  const { price } = useGetTokenPrice(Number(currency?.id || 0));

  const { data } = useGetTotalTickets(roundActive?.id);

  const totalPrize = useMemo(() => {
    return Number(fromNano(roundActive?.totalPrizes || 0));
  }, [roundActive?.totalPrizes]);

  const totalPrizeUsd = useMemo(() => {
    return price * totalPrize;
  }, [price, totalPrize]);

  const prizePot = useMemo(() => {
    return (
      <div className="p-5 border-y border-y-navigate-tab min-h-[12.875rem]">
        <AnimatePresence mode="wait">
          <motion.div key={roundActiveNumber} {...slideAnimation}>
            <VStack align={'center'}>
              <div className="text-white">
                <div className="text-center">Prize Pot</div>

                <HStack pos={'center'} spacing={8}>
                  <Image src={'/images/tokens/ton_symbol.webp'} width={30} height={30} alt="ton" />
                  <span className="text-primary text-2xl font-semibold">{`${prettyNumber(roundNumber(totalPrize))} ${tokenSymbol}`}</span>
                </HStack>

                <div className="text-xs text-gray-color text-center">{`~ ${prettyNumber(roundNumber(totalPrizeUsd))} USD`}</div>
              </div>

              <PoolAction
                pool={pool}
                roundActive={roundActive}
                holdingTicket={data || 0}
                isBeforeRoundEnd={isBeforeRoundEnd}
              />
            </VStack>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }, [data, isBeforeRoundEnd, pool, roundActive, roundActiveNumber, tokenSymbol, totalPrize, totalPrizeUsd]);

  const prizePotWinningNumber = useMemo(() => {
    return (
      <VStack className="min-h-[11.375rem] border-t border-t-navigate-tab">
        <AnimatePresence mode="wait">
          <motion.div key={roundActiveNumber} {...slideAnimation} className="flex-1 flex flex-col">
            <VStack spacing={0} justify={'between'} className="flex-1">
              <WinningNumber
                code={roundActive?.winningCode || '????'}
                titleClassName="mx-auto"
                spacing={12}
                className="py-2"
              />

              <div className="border-y border-y-navigate-tab py-4">
                <UserTicketCount holdingTicket={data || 0} />
              </div>
            </VStack>
          </motion.div>
        </AnimatePresence>
      </VStack>
    );
  }, [roundActiveNumber, roundActive?.winningCode, data]);

  const renderContent = useMemo(() => {
    if (!isEndRound) {
      return prizePot;
    }

    return prizePotWinningNumber;
  }, [isEndRound, prizePot, prizePotWinningNumber]);

  return <>{renderContent}</>;
};

export default PoolPrizePot;
