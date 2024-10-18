import { useUserStore } from '@/stores';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

import { env } from '@/lib/const';
import { refreshTokenRequest } from './auth';
// import Router from 'next/router';
// import { ROUTES } from '@/lib/routes';

export const request = axios.create({
  baseURL: env.API_URL,
});

const onRefreshToken = async () => {
  const store = useUserStore.getState();
  const refreshToken = store?.refreshToken;

  if (refreshToken) {
    try {
      const { data } = await refreshTokenRequest(refreshToken);

      store?.setAccessToken(data?.accessToken);
      store?.setRefreshToken(data?.refreshToken);

      return data?.accessToken;
    } catch (e) {
      // Router.replace(ROUTES.HOME);
      store?.logout();
    }
  } else {
    // Router.replace(ROUTES.HOME);
    store?.logout();
  }

  return null;
};

const handleSuccess = (res: AxiosResponse) => {
  res.meta = res?.data?.meta;
  res.data = res?.data?.data;

  return res;
};

const handleError = async (error: any) => {
  // const originalRequest = error.config!;
  const data = error?.response?.data as any;

  // if (data?.meta?.code === 401 && !originalRequest?._retry) {
  //   originalRequest._retry = true;

  //   const token = await onRefreshToken();

  //   axios.defaults.headers.Authorization = `Bearer ${token}`;

  //   return request(originalRequest);
  // }

  const store = useUserStore.getState();
  store?.logout();

  return Promise.reject(data?.meta || data || error);
};

request.interceptors.response.use(handleSuccess, handleError);

request.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = useUserStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);
