import React, { FC, memo, useMemo } from 'react';
import { IGetPoolDetailData, IGetPoolDetailRound } from '@/apis/pools';
import { Icons } from '@/assets/icons';
import { motion } from 'framer-motion';

import { prettyNumber } from '@/lib/common';
import { cn } from '@/lib/utils';
import { HStack, VStack } from '@/components/ui/Utilities';

import MatchItem from './MatchItem';
import { fromNano } from '@ton/core';

interface Props {
  pool: IGetPoolDetailData | undefined;
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
  isEndRound?: boolean;
  roundActive: IGetPoolDetailRound;
}

const PoolInfo: FC<Props> = ({ pool, roundActive, isShow, setIsShow, isEndRound = false }) => {
  const currency = pool?.currency;
  const poolPrizes = pool?.poolPrizes;

  const toggleShow = () => {
    setIsShow(!isShow);
  };

  const renderInfo = useMemo(() => {
    if (!isEndRound) {
      return (
        <div className="p-5 border-x-navigate-tab border-x">
          <VStack className="text-white ">
            <span className="text-xs">
              Match the winning value in the same order to share prizes. Current prizes up for grabs:
            </span>

            <div className="grid grid-cols-2 gap-3">
              {poolPrizes?.map((item, index) => {
                const allocationRate = Number(item?.allocation || 0) / 100;
                const totalPrizes = Number(fromNano(roundActive?.totalPrizes || 0));
                const value = totalPrizes * allocationRate;

                return (
                  <MatchItem
                    key={`${item?.id}-${index}`}
                    title={`Match first ${item?.matchNumber}`}
                    value={`${prettyNumber(Number(value).toFixed(2))} ${currency?.symbol || ''}`}
                    subValue={`~ ${prettyNumber(Number(0 * allocationRate).toFixed(2))} USD`}
                  />
                );
              })}
            </div>
          </VStack>
        </div>
      );
    }

    return (
      <VStack className="p-5 border-x-navigate-tab border-x">
        <VStack spacing={4}>
          <VStack spacing={2}>
            <span className="text-white font-medium text-base">Prize Pot</span>

            <span>
              <span className="text-2xl font-semibold text-primary">{`${prettyNumber(3953)} ${
                currency?.symbol || ''
              }`}</span>{' '}
              <span className="text-sm text-gray-color">~ {prettyNumber(Number(10000).toFixed(2))} USD</span>
            </span>
          </VStack>

          <VStack spacing={12}>
            <span className="text-sm">Total ticket this round: 89</span>
            <span className="text-sm">Match the wining value in the same order to share prize.</span>
          </VStack>
        </VStack>
        <div className="grid grid-cols-2 gap-3">
          {poolPrizes?.map((item, index) => {
            const allocationRate = Number(item?.allocation) / 100;
            return (
              <MatchItem
                key={`${item?.id}-${index}`}
                title={`Match first ${item?.matchNumber}`}
                value={`${prettyNumber(Number(2500 * allocationRate).toFixed(2))} ${currency?.symbol || ''}`}
                subValue={`~ ${prettyNumber(Number(10000 * allocationRate).toFixed(2))} USD`}
              >
                <VStack spacing={2} className="mt-1">
                  <span className="text-xs">61.170005 TON each</span>
                  <span className="text-xs">4 Winning Tickets</span>
                </VStack>
              </MatchItem>
            );
          })}
        </div>
      </VStack>
    );
  }, [currency?.symbol, isEndRound, poolPrizes, roundActive?.totalPrizes]);

  return (
    <div>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isShow ? 'auto' : 0, opacity: isShow ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        {renderInfo}
      </motion.div>

      <HStack onClick={toggleShow} pos={'center'} className="bg-navigate-tab py-3">
        <button className="flex gap-2 justify-center text-gray-color items-center">
          <span>{isShow ? 'Hide' : 'Detail'}</span>
          <Icons.chevronDown className={cn('transition-all ease-linear duration-150', { 'rotate-180': isShow })} />
        </button>
      </HStack>
    </div>
  );
};

export default memo(PoolInfo);
