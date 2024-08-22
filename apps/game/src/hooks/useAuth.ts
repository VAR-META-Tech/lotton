import { ILoginByWalletUser } from '@/apis/auth';
import { useUserStore } from '@/stores';

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

  const setAccessToken = useUserStore.use.setAccessToken();
  const setRefreshToken = useUserStore.use.setRefreshToken();
  const setUser = useUserStore.use.setUser();

  const setUserData = (data: ISetUserData) => {
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setUser(data.user);
  };

  return {
    isLoggedIn: !!accessToken && !!refreshToken && !!user && status === 'ready',
    accessToken,
    refreshToken,
    user,
    status,
    setUserData,
  };
};
