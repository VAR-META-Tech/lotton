import React, { FC, useMemo } from 'react';
import { Icons } from '@/assets/icons';

import { useCopy } from '@/hooks/useCopy';
import { HStack } from '@/components/ui/Utilities';

interface Props {
  type: string;
  address: string;
  amount: string;
}

const TransactionItem: FC<Props> = ({ type, address, amount }) => {
  const [copied, copy] = useCopy();

  const renderCopyBtn = useMemo(() => {
    if (!copied) {
      return (
        <button onClick={() => copy(address)}>
          <Icons.copy size={16} />
        </button>
      );
    }

    return (
      <button>
        <Icons.check size={16} className="text-gray-color" />
      </button>
    );
  }, [address, copied, copy]);

  const renderIcon = useMemo(() => {
    if (type === 'Claim') {
      return <Icons.download size={16} className="stroke-white" />;
    }

    return <Icons.upload size={16} className="stroke-white" />;
  }, [type]);

  return (
    <HStack pos={'apart'} align={'center'} className="pt-2 pb-3 text-white border-b border-b-gray-color">
      <HStack spacing={8}>
        <HStack pos={'center'} align={'center'} className="w-8 h-8 bg-navigate-tab rounded-full">
          {renderIcon}
        </HStack>

        <div>
          <span className="text-sm">{type}</span>
          <HStack spacing={16}>
            <span className="text-xs text-gray-400">{address}</span>

            {renderCopyBtn}
          </HStack>
        </div>
      </HStack>

      <div className="font-bold">{amount}</div>
    </HStack>
  );
};

export default TransactionItem;
