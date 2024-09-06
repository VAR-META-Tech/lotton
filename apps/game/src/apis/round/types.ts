import { TResponse } from '@/types';

export interface IGetTotalTicketsParams {
  id: number;
}

export interface IGetTotalTicketsResponse extends TResponse<number> {}
