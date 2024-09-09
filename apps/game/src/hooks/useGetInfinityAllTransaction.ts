import { useInfinityGetAllTransactionQuery } from '@/apis/transaction';

export const useGetInfinityAllTransaction = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching: loadingPool,
    isFetchingNextPage,
    ...rest
  } = useInfinityGetAllTransactionQuery({
    variables: {
      pageSizes: 10,
      page: 1,
    },
  });
  const transactionList = data?.pages?.flatMap((z) => z?.items) || [];

  return {
    data,
    transactionList,
    fetchNextPage,
    hasNextPage,
    loadingPool,
    isFetchingNextPage,
    ...rest,
  };
};
