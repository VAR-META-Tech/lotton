import React, { FC, memo } from 'react';
import { Icons } from '@/assets/icons';
import { motion } from 'framer-motion';

import { prettyNumber } from '@/lib/common';
import { cn } from '@/lib/utils';
import { HStack, VStack } from '@/components/ui/Utilities';

import MatchItem from './MatchItem';

interface Props {
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const PoolInfo: FC<Props> = ({ isShow, setIsShow }) => {
  const toggleShow = () => {
    setIsShow(!isShow);
  };

  return (
    <div>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isShow ? 'auto' : 0, opacity: isShow ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-5 border-x-navigate-tab border-x">
          <VStack className="text-white ">
            <span className="text-xs">
              Match the winning value in the same order to share prizes. Current prizes up for grabs:
            </span>

            <div className="grid grid-cols-2 gap-3">
              <MatchItem
                title={'Match first 1'}
                value={`${prettyNumber(1000)} TON`}
                subValue={`~ ${prettyNumber(10000)} USD`}
              />
              <MatchItem
                title={'Match first 2'}
                value={`${prettyNumber(1000)} TON`}
                subValue={`~ ${prettyNumber(10000)} USD`}
              />
              <MatchItem
                title={'Match first 3'}
                value={`${prettyNumber(1000)} TON`}
                subValue={`~ ${prettyNumber(10000)} USD`}
              />
              <MatchItem
                title={'Match first 4'}
                value={`${prettyNumber(1000)} TON`}
                subValue={`~ ${prettyNumber(10000)} USD`}
              />
            </div>
          </VStack>
        </div>
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
