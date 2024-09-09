import { IPagination, TResponse } from '@/types';

export interface IGetAllTransactionParams {
  fromDate?: string;
  toDate?: string;
  sort?: string;
  page: number;
  pageSizes: number;
  type?: string;
}

export interface IGetAllTransactionResponse extends TResponse<IGetAllTransactionData> {}

export interface IGetAllTransactionData {
  items: IGetAllTransactionItem[];
  meta: IPagination;
}

export interface IGetAllTransactionItem {
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  id: number;
  fromAddress: string;
  toAddress: string;
  blockTimestamp: string;
  transactionHash: string;
  tokenId: number;
  type: string;
  quantity: number;
  value: string;
  tokenName: string;
  tokenDecimals: number;
  tokenSymbol: string;
}
