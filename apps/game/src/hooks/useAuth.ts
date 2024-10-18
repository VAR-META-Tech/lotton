import { ILoginByWalletUser } from '@/apis/auth';
import { convertTonWalletToBase64 } from '@/lib/common';
import { useUserStore } from '@/stores';
import { useTonWallet } from '@tonconnect/ui-react';

interface ISetUserData {
  accessToken: string;
  refreshToken: string;
  user: ILoginByWalletUser;
}

export const useAuth = () => {
  const accessToken = useUserStore.use.accessToken();
  const refreshToken = useUserStore.use.refreshToken();
  const user = useUserStore.use.user();
  const status = useUserStore.use.status();

  const wallet = useTonWallet();
  const connected = !!wallet;

  const setAccessToken = useUserStore.use.setAccessToken();
  const setRefreshToken = useUserStore.use.setRefreshToken();
  const setUser = useUserStore.use.setUser();
  const logout = useUserStore.use.logout();

  const setUserData = (data: ISetUserData) => {
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setUser(data.user);
  };

  return {
    isLoggedIn: !!accessToken && !!refreshToken && !!user && status === 'ready' && connected,
    accessToken,
    refreshToken,
    user,
    status,
    setUserData,
    logout,
    walletBase64: convertTonWalletToBase64(user?.wallet || ''),
  };
};
