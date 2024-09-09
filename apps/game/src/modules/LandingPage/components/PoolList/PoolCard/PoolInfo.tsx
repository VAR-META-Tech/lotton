import React, { FC, memo, useMemo } from 'react';
import { IGetPoolDetailData, IGetPoolDetailRound } from '@/apis/pools';
import { Icons } from '@/assets/icons';
import { motion } from 'framer-motion';

import { prettyNumber, roundNumber } from '@/lib/common';
import { cn } from '@/lib/utils';
import { HStack, VStack } from '@/components/ui/Utilities';

import MatchItem from './MatchItem';
import { fromNano } from '@ton/core';
import { useGetTokenPrice } from '@/hooks/useGetTokenPrice';

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

  const { price } = useGetTokenPrice(Number(currency?.id || 0));

  const totalPrize = useMemo(() => {
    return Number(fromNano(roundActive?.totalPrizes || 0));
  }, [roundActive?.totalPrizes]);

  const totalPrizeUsd = useMemo(() => {
    return price * totalPrize;
  }, [price, totalPrize]);

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
                const value = totalPrize * allocationRate;
                const usdValue = value * price;

                return (
                  <MatchItem
                    key={`${item?.id}-${index}`}
                    title={`Match first ${item?.matchNumber}`}
                    value={`${prettyNumber(roundNumber(value))} ${currency?.symbol || ''}`}
                    subValue={`~ ${prettyNumber(roundNumber(usdValue))} USD`}
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
              <span className="text-2xl font-semibold text-primary">{`${prettyNumber(roundNumber(totalPrize))} ${
                currency?.symbol || ''
              }`}</span>{' '}
              <span className="text-sm text-gray-color">~ {prettyNumber(roundNumber(totalPrizeUsd))} USD</span>
            </span>
          </VStack>

          <VStack spacing={12}>
            <span className="text-sm">Total ticket this round: 89</span>
            <span className="text-sm">Match the wining value in the same order to share prize.</span>
          </VStack>
        </VStack>
        <div className="grid grid-cols-2 gap-3">
          {poolPrizes?.map((item, index) => {
            const allocationRate = Number(item?.allocation || 0) / 100;
            const value = totalPrize * allocationRate;

            const eachMatch = roundActive?.winners?.find((winner) => winner?.winningMatch === item?.matchNumber);
            const eachMatchValue = Number(eachMatch?.totalWinning || 0);

            return (
              <MatchItem
                key={`${item?.id}-${index}`}
                title={`Match first ${item?.matchNumber}`}
                value={`${prettyNumber(roundNumber(value))} ${currency?.symbol || ''}`}
                subValue={`~ ${prettyNumber(roundNumber(value * price))} USD`}
              >
                <VStack spacing={2} className="mt-1">
                  <span className="text-xs">
                    {eachMatch ? roundNumber(Number(value) / eachMatchValue) : 0} TON each
                  </span>
                  <span className="text-xs">{eachMatchValue} Winning Tickets</span>
                </VStack>
              </MatchItem>
            );
          })}
        </div>
      </VStack>
    );
  }, [currency?.symbol, isEndRound, poolPrizes, price, roundActive?.winners, totalPrize, totalPrizeUsd]);

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
