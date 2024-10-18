import { useGetTotalTicketsQuery } from '@/apis/round';
import { useEffect } from 'react';

export const useGetTotalTickets = (id: number) => {
  const { data, refetch, ...rest } = useGetTotalTicketsQuery({
    variables: {
      id: id || 0,
    },
    enabled: !!id,
  });

  useEffect(() => {
    const refetchInterval = setInterval(() => {
      refetch();
    }, 10000);

    return () => clearInterval(refetchInterval);
  }, [refetch]);

  return {
    data,
    refetch,
    ...rest,
  };
};
