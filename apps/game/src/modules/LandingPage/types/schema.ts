import { z } from 'zod';

export const buyTicketSchema = z.object({
  amount: z.number().refine((data) => {
    if (!data) return false;

    return true;
  }, 'This amount is required'),
  balance: z.number(),
});

export type BuyTicketType = z.infer<typeof buyTicketSchema>;
