import React, { useEffect } from 'react';

import FullScreenLoading from '@/components/FullScreenLoading';
import { ROUTES } from './routes';
import { useUserQuery } from '@/apis/auth';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores';

export interface WithAuthProps {}

export default function withAuth<T extends WithAuthProps = WithAuthProps>(Component: React.ComponentType<T>) {
  const ComponentWithAuth = (props: Omit<T, keyof WithAuthProps>) => {
    const router = useRouter();

    const accessToken = useUserStore.use.accessToken();
    const setUser = useUserStore.use.setUser();
    const { data: userProfile } = useUserQuery();

    useEffect(() => {
      if (accessToken) return;
      router.replace(ROUTES.LOGIN);
    }, [accessToken, router]);

    useEffect(() => {
      if (userProfile) setUser(userProfile.data);
    }, [userProfile, setUser]);

    if (!accessToken) {
      return <FullScreenLoading />;
    }

    return <Component {...(props as T)} />;
  };

  return ComponentWithAuth;
}
