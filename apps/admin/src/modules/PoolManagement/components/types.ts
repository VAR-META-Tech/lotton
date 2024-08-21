import { z } from 'zod';

export const poolSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  name: z.string().optional(),
});

export type PoolSchema = z.infer<typeof poolSchema>;

export interface IGetAllPoolParams {
  search?: string;
  status?: string;
  name?: string;
  page?: number;
  limit?: number;
  sort?: string;
}
