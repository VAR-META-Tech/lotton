import { TResponse } from '@/types';

export interface IMeta {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface IGetPoolsParams {
  search?: string;
  page?: number;
  pageSizes?: number;
  status?: string;
}

export interface IPoolItem {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  sequency: number;
  totalRounds: number;
  ticketPrice: string;
}

export interface IGetPoolsResponse {
  items: IPoolItem[];
  meta: IMeta;
}

export interface IGetPoolsListResponse extends TResponse {}

export interface Currency {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: number;
  name: string;
  icon: string | null;
  decimals: number;
  symbol: string;
  contractAddress: string;
  abi: string;
  beginningBlock: string;
  isActive: boolean;
}

export interface Round {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: number;
  roundNumber: number;
  startTime: string;
  endTime: string;
  winningCode: string | null;
}

export interface PoolPrize {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: number;
  matchNumber: number;
  allocation: number;
}

export interface IGetPoolDetail {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  sequency: number;
  totalRounds: number;
  ticketPrice: string;
  currency: Currency;
  rounds: Round[];
  poolPrizes: PoolPrize[];
}

export interface IGetPoolDetailResponse extends TResponse {}

export interface IGetRoundsParams {
  search?: string;
  page?: number;
  pageSizes?: number;
  status?: string;
}

export interface IRoundItem {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: number;
  roundNumber: number;
  startTime: string;
  endTime: string;
  winningCode: string | null;
  prizePool: number;
  symbol: string;
  poolName: string;
}

export interface IGetRoundsResponse {
  items: IRoundItem[];
  meta: IMeta;
}

export interface IGetRoundsListResponse extends TResponse {}

export interface ICurrencyResCreate {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: number;
  name: string;
  icon: string | null;
  decimals: number;
  symbol: string;
  contractAddress: string;
  abi: string;
  beginningBlock: string;
  isActive: boolean;
}

export interface IResCreatePool {
  name: string;
  currency: ICurrencyResCreate;
  sequency: number;
  totalRounds: number;
  startTime: string;
  ticketPrice: number;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: number;
}

export interface IPoolPrize {
  matchNumber: number;
  allocation: number;
}

export interface IPayloadCreatePool {
  name: string;
  currency: number;
  startTime: string;
  sequency: number;
  ticketPrice: number;
  poolPrizes: IPoolPrize[];
  totalRounds: number;
}

export interface ITokenItem {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: number;
  name: string;
  icon: string | null;
  decimals: number;
  symbol: string;
  contractAddress: string;
  beginningBlock: string;
  isActive: boolean;
}

export interface IGetTokensResponse {
  items: ITokenItem[];
  meta: IMeta;
}

export interface IGetTokenListResponse extends TResponse {}
