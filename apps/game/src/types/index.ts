import { FC, PropsWithChildren, type SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {}
}

export type ApiError = {
  code: number;
  message: any;
};

export interface IMeta {
  code: number;
  message: string;
}

export type TResponse<T> = {
  meta: IMeta;
  data: T;
};

export type FCC<P = {}> = FC<PropsWithChildren<P>>;

export interface IOption<T> {
  label: string;
  value: T;
}
