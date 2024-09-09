import React, { FC, useMemo } from 'react';
import { Icons } from '@/assets/icons';

import { useCopy } from '@/hooks/useCopy';
import { HStack } from '@/components/ui/Utilities';
import { convertTonWalletToBase64, prettyNumber, roundNumber, shortenAddress } from '@/lib/common';
import { IGetAllTransactionItem } from '@/apis/transaction';

interface Props {
  transaction: IGetAllTransactionItem;
}

const TransactionItem: FC<Props> = ({ transaction }) => {
  const [copied, copy] = useCopy();
  const address = convertTonWalletToBase64(transaction?.fromAddress || '');
  const type = transaction?.type || '';
  const tokenSymbol = transaction?.tokenSymbol || '';
  const isClaim = type === 'claim';
  const amount = `${prettyNumber(roundNumber(transaction?.value))} ${tokenSymbol}`;

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
    if (transaction?.type === 'claim') {
      return <Icons.download size={16} className="stroke-white" />;
    }

    return <Icons.upload size={16} className="stroke-white" />;
  }, [transaction?.type]);

  return (
    <HStack pos={'apart'} align={'center'} className="pt-2 pb-3 text-white border-b border-b-gray-color">
      <HStack spacing={8}>
        <HStack pos={'center'} align={'center'} className="w-8 h-8 bg-navigate-tab rounded-full">
          {renderIcon}
        </HStack>

        <div>
          <span className="text-sm">{isClaim ? 'Claimed' : 'Buy tickets'}</span>
          <HStack spacing={16}>
            <span className="text-xs text-gray-400">{shortenAddress(address, 16)}</span>

            {renderCopyBtn}
          </HStack>
        </div>
      </HStack>

      <div className="font-bold">{isClaim ? `+ ${amount}` : `- ${amount}`}</div>
    </HStack>
  );
};

export default TransactionItem;
