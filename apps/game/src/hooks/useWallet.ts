import { useTonWallet } from '@tonconnect/ui-react';
import { useGetBalanceQuery } from '@/apis/wallet';

export const useWallet = () => {
  const wallet = useTonWallet();

  const { data, ...rest } = useGetBalanceQuery({
    variables: {
      address: wallet?.account?.address || '',
    },
    enabled: !!wallet,
  });

  return {
    data,
    balance: Number(data?.result?.balance) / 1e9 || 0,
    ...rest,
  };
};
