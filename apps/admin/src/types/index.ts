import { NextPage } from 'next';
import { FC, PropsWithChildren, ReactElement, ReactNode, type SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

declare global {
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

type Layout = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};

export type CP<P = {}> = Layout & P;