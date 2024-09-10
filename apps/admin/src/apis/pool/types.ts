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

export interface IGetPoolDetailResponse extends TResponse<IGetPoolDetail> { }

export interface IGetRoundsParams {
  search?: string;
  page?: number;
  pageSizes?: number;
  status?: string;
}

export interface IGetRoundsWinningTicketParams {
  roundId?: number;
  matchNumber?: number;
  page?: number;
  pageSizes?: number;
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
  tokenDecimals: number;
}

export interface IGetRoundsResponse {
  items: IRoundItem[];
  meta: IMeta;
}

export interface IGetRoundsListResponse extends TResponse<IGetRoundsResponse> { }

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

export interface IGetTokenListResponse extends TResponse<IGetTokensResponse> { }

export interface IMatchDetail {
  id: number;
  matchNumber: number;
  allocation: number;
  createdAt: string;
  updatedAt: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: number;
  winningTickets: string;
  amount: number;
  amountPerTicket: number | null;
}

export interface IGetRoundDetail {
  id: number;
  roundNumber: number;
  startTime: string;
  endTime: string;
  winningCode: string;
  winningBlock: string;
  createdAt: string;
  updatedAt: string;
  totalTickets: number;
  totalUsers: number;
  currentPrizes: number;
  previousPrizes: number;
  totalPrizes: number;
  totalWinningPrizes: number;
  winningTickets: string;
  tokenDecimals: number;
  tokenName: string;
  tokenSymbol: string;
  matchs: IMatchDetail[];
}


export interface IGetRoundDetailResponse extends TResponse<IGetRoundDetail> { }

export interface IItems {
  id: number;
  userWallet: string;
  winningMatch: number;
  winningCode: string;
  ticketCode: string;
  status: string;
  createdAt: string;
  updatedAt: string;
} 

export interface IGetRoundsWinningTicket {
  items: IItems[];
}

export interface IGetRoundsWinningTicketResponse extends TResponse<IGetRoundsWinningTicket> { }