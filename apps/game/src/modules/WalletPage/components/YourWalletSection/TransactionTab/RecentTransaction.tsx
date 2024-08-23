import React, { useCallback } from 'react';
import { transactions } from '@/modules/WalletPage/utils/const';
import { format } from 'date-fns';

import { checkIsSameDay } from '@/lib/common';

import TransactionItem from './TransactionItem';

const groupTransactionsByDate = (transactions: any) => {
  return transactions.reduce((groups: any, transaction: any) => {
    const date = new Date(transaction.date).toISOString().split('T')[0];

    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});
};

const RecentTransaction = () => {
  const groupedTransactions = groupTransactionsByDate(transactions);

  const renderDate = useCallback((value: string) => {
    const date = new Date(value);
    const now = new Date();
    const isSameDay = checkIsSameDay(date, now);

    if (isSameDay) {
      return 'Today';
    }

    return format(new Date(date), 'MMM dd, yyyy');
  }, []);

  return (
    <div className="py-4">
      {Object.keys(groupedTransactions).map((date) => (
        <div key={date} className="pb-6">
          <div className="text-base font-medium pb-4 text-white">{renderDate(date)}</div>

          {groupedTransactions[date].map((transaction: any, index: number) => (
            <TransactionItem
              key={index}
              type={transaction.type}
              address={transaction.address}
              amount={transaction.amount}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default RecentTransaction;
