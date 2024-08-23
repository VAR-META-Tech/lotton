import { useGetPoolDetailQuery } from '@/apis/pools';

export const useGetPoolDetail = ({ poolId, isActive }: { poolId: number; isActive: boolean }) => {
  const { data, ...rest } = useGetPoolDetailQuery({
    variables: {
      id: String(poolId),
    },
    enabled: !!poolId && isActive,
  });

  return {
    data,
    pool: data?.data,
    currency: data?.data?.currency,
    rounds: data?.data?.rounds || [],
    poolPrizes: data?.data?.poolPrizes || [],
    ...rest,
  };
};
