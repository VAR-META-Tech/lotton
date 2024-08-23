import Router from 'next/router';
import { useUserStore } from '@/stores';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

import { env } from '@/lib/const';

export const request = axios.create({
  baseURL: env.API_URL,
});

const onRefreshToken = async () => {
  const store = useUserStore.getState();
  const refreshToken = store?.refreshToken;

  if (refreshToken) {
    try {
      // TODO: REFRESH TOKEN
      // const {
      //   data: { accessToken, refreshToken: newRefreshToken },
      // } = await refreshTokenRequest(refreshToken);

      // store?.setAccessToken(accessToken);
      // store?.setRefreshToken(newRefreshToken);

      return '';
      // eslint-disable-next-line no-unreachable
    } catch (e) {
      Router.replace('/');
      store?.logout();
    }
  } else {
    Router.replace('/');
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
  const originalRequest = error.config!;
  const data = error?.response?.data as any;
  const statusCode = error?.response?.status;

  if (statusCode === 401 && !originalRequest?._retry) {
    originalRequest._retry = true;

    const token = await onRefreshToken();
    axios.defaults.headers.Authorization = `Bearer ${token}`;
    return request(originalRequest);
  }

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
