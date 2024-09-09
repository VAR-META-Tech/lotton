import { useTonWallet } from '@tonconnect/ui-react';
import { useGetBalanceQuery } from '@/apis/wallet';
import { useCallback, useEffect } from 'react';
import { useTonConnect } from './useTonConnect';
import { useAuth } from './useAuth';

export const useWallet = () => {
  const wallet = useTonWallet();
  const { tonConnectUI } = useTonConnect();
  const { logout } = useAuth();

  const { data, refetch, ...rest } = useGetBalanceQuery({
    variables: {
      address: wallet?.account?.address || '',
    },
    enabled: !!wallet,
  });

  useEffect(() => {
    if (wallet) return;

    const refetchInterval = setInterval(() => {
      refetch();
    }, 5000);

    return () => clearInterval(refetchInterval);
  }, [refetch, wallet]);

  const handleDisconnectWallet = useCallback(async () => {
    logout();
    await tonConnectUI.disconnect();
  }, [logout, tonConnectUI]);

  return {
    data,
    wallet,
    balance: Number(data?.result?.balance) / 1e9 || 0,
    refetch,
    handleDisconnectWallet,
    ...rest,
  };
};
