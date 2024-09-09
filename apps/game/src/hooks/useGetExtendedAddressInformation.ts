import { useGetExtendedAddressInformationQuery } from '@/apis/wallet';
import { useAuth } from './useAuth';
import { useEffect } from 'react';

export const useGetExtendedAddressInformation = () => {
  const { user } = useAuth();

  const { data, refetch, ...rest } = useGetExtendedAddressInformationQuery({
    variables: {
      address: user?.wallet || '',
    },
    enabled: !!user?.wallet,
  });

  useEffect(() => {
    if (user?.wallet) {
      refetch();
    }
  }, [refetch, user?.wallet]);

  return {
    data,
    accountAddress: data?.result?.address?.account_address || '',
    refetch,
    ...rest,
  };
};
