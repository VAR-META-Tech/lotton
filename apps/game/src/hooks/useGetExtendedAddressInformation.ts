import { useGetExtendedAddressInformationQuery } from '@/apis/wallet';
import { useEffect } from 'react';

export const useGetExtendedAddressInformation = (wallet: string) => {
  const { data, refetch, ...rest } = useGetExtendedAddressInformationQuery({
    variables: {
      address: wallet,
    },
    enabled: !!wallet,
  });

  useEffect(() => {
    if (wallet) {
      refetch();
    }
  }, [refetch, wallet]);

  return {
    data,
    accountAddress: data?.result?.address?.account_address || '',
    refetch,
    ...rest,
  };
};
