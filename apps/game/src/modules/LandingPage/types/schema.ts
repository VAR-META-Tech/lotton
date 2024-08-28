import { z } from 'zod';

export const buyTicketSchema = z.object({
  amount: z.number(),
});

export type BuyTicketType = z.infer<typeof buyTicketSchema>;
