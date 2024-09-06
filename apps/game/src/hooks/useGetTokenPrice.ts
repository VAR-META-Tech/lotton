import { useGetTokenPriceQuery } from '@/apis/token';

export const useGetTokenPrice = (tokenId: number) => {
  const { data, ...rest } = useGetTokenPriceQuery({
    variables: {
      tokenId: tokenId || 0,
    },
    enabled: !!tokenId,
  });

  return {
    data,
    price: Number(data?.price || 0),
    ...rest,
  };
};
