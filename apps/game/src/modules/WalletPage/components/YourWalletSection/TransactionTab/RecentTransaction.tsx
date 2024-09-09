import React, { useCallback, useEffect } from 'react';
import { format } from 'date-fns';

import { checkIsSameDay } from '@/lib/common';

import TransactionItem from './TransactionItem';
import { useGetInfinityAllTransaction } from '@/hooks/useGetInfinityAllTransaction';
import { useIntersection } from '@mantine/hooks';
import { IGetAllTransactionItem } from '@/apis/transaction';
import { Show } from '@/components/ui/Utilities';
import TransactionSkeleton from './TransactionSkeleton';

const groupTransactionsByDate = (transactions: IGetAllTransactionItem[]) => {
  return transactions.reduce(
    (groups: { [key: string]: IGetAllTransactionItem[] }, transaction: IGetAllTransactionItem) => {
      const date = new Date(transaction.createdAt).toISOString().split('T')[0];

      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    },
    {}
  );
};

const RecentTransaction = () => {
  const { transactionList, fetchNextPage, hasNextPage, loadingPool, isFetchingNextPage, isLoading } =
    useGetInfinityAllTransaction();
  const groupedTransactions = groupTransactionsByDate(transactionList);

  const renderDate = useCallback((value: string) => {
    const date = new Date(value);
    const now = new Date();
    const isSameDay = checkIsSameDay(date, now);

    if (isSameDay) {
      return 'Today';
    }

    return format(new Date(date), 'MMM dd, yyyy');
  }, []);

  const { ref: rootLoadMore, entry } = useIntersection({
    threshold: 1,
  });

  useEffect(() => {
    if (!entry?.isIntersecting || isFetchingNextPage || !hasNextPage) return;
    fetchNextPage();
  }, [entry?.isIntersecting, fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="py-4">
      <Show when={isLoading}>
        {Array.from({ length: 3 }).map((_, index) => (
          <TransactionSkeleton key={index} />
        ))}
      </Show>

      {Object.keys(groupedTransactions).map((date) => (
        <div key={date} className="pb-6">
          <div className="text-base font-medium pb-4 text-white">{renderDate(date)}</div>

          {groupedTransactions[date].map((transaction: IGetAllTransactionItem, index: number) => (
            <TransactionItem transaction={transaction} key={`${transaction?.id}-${index}`} />
          ))}

          <Show when={loadingPool}>
            <TransactionSkeleton />
            <TransactionSkeleton />
            <TransactionSkeleton />
            <TransactionSkeleton />
          </Show>

          {!!transactionList?.length && <div ref={rootLoadMore} />}
        </div>
      ))}
    </div>
  );
};

export default RecentTransaction;
