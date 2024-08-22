import { z } from 'zod';

export const bondRequestPendingFilterSchema = z.object({
  amount: z.string().optional(),
});

export type TransactionHistoryFilterType = z.infer<typeof bondRequestPendingFilterSchema>;
