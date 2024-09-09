import { request } from '../axios';
import type { IGetTotalTicketsParams } from './types';

export const getTotalTicketsRequest = async (params: IGetTotalTicketsParams): Promise<number> => {
  const { data } = await request({
    url: `/api/rounds/${params.id}/total-tickets`,
    method: 'GET',
    params,
  });

  return data;
};
