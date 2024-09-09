import { TResponse } from '@/types';

export interface IGetTokenPriceParams {
  tokenId: number;
}

export interface IGetTokenPriceResponse extends TResponse<IGetTokenPriceData> {}

export interface IGetTokenPriceData {
  createdAt: string;
  updatedAt: string;
  id: number;
  price: string;
  token: IGetTokenPriceToken;
}

export interface IGetTokenPriceToken {
  name: string;
  icon: any;
  symbol: string;
}
