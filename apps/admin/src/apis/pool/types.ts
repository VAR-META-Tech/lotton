import { TResponse } from "@/types";

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
  totalRounds: number
  ticketPrice: string;
}

export interface IGetPoolsResponse {
  items: IPoolItem[];
  meta: IMeta;
}

export interface IGetPoolsListResponse extends TResponse<IGetPoolsResponse> { }

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
};

export interface Round {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: number;
  roundNumber: number;
  startTime: string;
  endTime: string;
  winningHash: string | null;
};

export interface PoolPrize {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: number;
  matchNumber: number;
  allocation: number;
};

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
};

export interface IGetPoolDetailResponse extends TResponse<IGetPoolDetail> { }

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
  winningHash: string | null;
  prizePool: number,
  symbol: string,
  poolName: string,
}

export interface IGetRoundsResponse {
  items: IRoundItem[];
  meta: IMeta;
}


export interface IGetRoundsListResponse extends TResponse<IGetRoundsResponse> { }