import { z } from 'zod';

export const poolDetailSchema = z.object({
  name: z.string().optional(),
  sequency: z.number().optional(),
  currency: z.string().optional(),
  totalRound: z.number().optional(),
  upcomingRound: z.number().optional(),
  startTime: z.any().optional(),
  endTime: z.any().optional(),
  match1: z.number().optional(),
  match2: z.number().optional(),
  match3: z.number().optional(),
  match4: z.number().optional(),
});

export type PoolDetailSchema = z.infer<typeof poolDetailSchema>;
