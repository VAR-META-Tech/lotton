import { IPagination, TResponse } from '@/types';

export interface IGetPoolsParams {
  status?: 'ongoing' | 'upcoming' | 'closed';
  search?: string;
  pageSizes?: number;
  page?: number;
}

export interface IGetPoolsResponse extends TResponse<IGetPoolsData> {}

export interface IGetPoolsData {
  items: IGetPoolsDataItem[];
  meta: IPagination;
}

export interface IGetPoolsDataItem {
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  sequency: number;
  totalRounds: number;
  ticketPrice: string;
}

export interface IGetPoolDetailParams {
  id: string;
}

export interface IGetPoolDetailResponse extends TResponse<IGetPoolDetailData> {}

export interface IGetPoolDetailData {
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  sequency: number;
  totalRounds: number;
  ticketPrice: string;
  currency: IGetPoolDetailCurrency;
  rounds: IGetPoolDetailRound[];
  poolPrizes: IGetPoolDetailPoolPrize[];
}

export interface IGetPoolDetailCurrency {
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  id: number;
  name: string;
  icon: any;
  decimals: number;
  symbol: string;
  contractAddress: string;
  abi: string;
  beginningBlock: string;
  isActive: boolean;
}

export interface IGetPoolDetailRound {
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  id: number;
  roundNumber: number;
  startTime: string;
  endTime: string;
  winningHash: any;
}

export interface IGetPoolDetailPoolPrize {
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  id: number;
  matchNumber: number;
  allocation: number;
}

export interface IGetPoolJoinedParams {
  type: string;
  pageSizes: number;
  page: number;
}

export interface IGetPoolJoinedResponse extends TResponse<IGetPoolJoinedData> {}

export interface IGetPoolJoinedData {
  items: IGetPoolJoinedItem[];
  meta: IPagination;
}

export interface IGetPoolJoinedItem {
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  id: number;
  poolIdOnChain: any;
  name: string;
  startTime: string;
  endTime: string;
  sequency: number;
  totalRounds: number;
  ticketPrice: string;
  rounds: IGetPoolJoinedItemRound[];
}

export interface IGetPoolJoinedItemRound {
  totalTicket: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  id: number;
  roundNumber: number;
  startTime: string;
  endTime: string;
  winningHash: string | null;
  ticket: IGetPoolJoinedItemTicket[];
}

export interface IGetPoolJoinedItemTicket {
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  id: number;
  userWallet: string;
  code: string;
  winningCode?: string;
  winningMatch?: number;
}
