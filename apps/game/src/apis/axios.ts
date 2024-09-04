import { useUserStore } from '@/stores';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

import { env } from '@/lib/const';
import { refreshTokenRequest } from './auth';

export const request = axios.create({
  baseURL: env.API_URL,
});

let isRefreshPending = false;

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
      store?.setAccessToken('');
      store?.setRefreshToken('');
    }
  } else {
    store?.setAccessToken('');
    store?.setRefreshToken('');
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

  if (data?.meta?.message === 'Unauthorized' && data?.meta?.code === 401 && !isRefreshPending) {
    isRefreshPending = true;

    const token = await onRefreshToken();

    if (token) isRefreshPending = false;

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
