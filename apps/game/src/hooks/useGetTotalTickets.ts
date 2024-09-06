import { useGetTotalTicketsQuery } from '@/apis/round';

export const useGetTotalTickets = (id: number) => {
  const { data, ...rest } = useGetTotalTicketsQuery({
    variables: {
      id: id || 0,
    },
    enabled: !!id,
  });

  return {
    data,
    ...rest,
  };
};
