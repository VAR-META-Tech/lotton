import type { AxiosHeaders, AxiosResponse as AxiosRes, InternalAxiosRequestConfig, RawAxiosHeaders } from 'axios';

declare module 'axios' {
  export interface AxiosResponse<T = any, D = any> extends AxiosRes<T, D> {
    data: T;
    meta?: any;
    status: number;
    statusText: string;
    headers: RawAxiosHeaders | AxiosHeaders;
    config: InternalAxiosRequestConfig<D>;
    request?: any;
  }
}
