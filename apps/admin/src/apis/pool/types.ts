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
  limit?: number;
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

export interface IGetMeResponse extends TResponse<IGetPoolsResponse> {}
