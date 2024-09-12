import { validationMessages } from '@/lib/validations/validation.utility';
import { z } from 'zod';

export const poolFilterSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  name: z.string().optional(),
});

export type PoolFilterSchema = z.infer<typeof poolFilterSchema>;
  
export interface CommonQuery  {
  page?: number;
  pageSizes?: number;
  order?: 'DESC' | 'ASC'
}

export interface IGetAllPoolParams extends CommonQuery {
  search?: string;
  status?: string;
  name?: string;
}

const poolNumberValidation = (fieldName: string) =>
  z
    .string({ required_error: `${fieldName} field is required` })
    .trim()
    .max(10, { message: `${fieldName} must be less than 10 characters.` })
    .refine((data) => {
      if (!data) return false;
      return true;
    }, `${fieldName} field is required`)
    .refine((data) => !Number.isNaN(Number(data)), `${fieldName} must be a number.`)
    .refine((data) => Number(data) >= 0, `${fieldName} must be positive integer numbers.`)
    .refine((data) => Number.isInteger(Number(data)), `${fieldName} must not be a decimal.`);

const priceValidation = (fieldName: string) =>
  z
    .string({ required_error: `${fieldName} field is required` })
    .trim()
    .max(10, { message: `${fieldName} must be less than 10 characters.` })
    .refine((data) => {
      if (!data) return false;
      return true;
    }, `${fieldName} field is required`)
    .refine((data) => !Number.isNaN(Number(data)), `${fieldName} must be a number.`)
    .refine((data) => Number(data) >= 0, `${fieldName} must be greater than 0.`);

export const poolSchema = z.object({
  name: z.string({ required_error: validationMessages.required('Name')}).trim().refine((data) => {
    if (!data) return false;
    return true;
  }, `Name field is required`),
  sequency: poolNumberValidation('Sequency'),
  currency: z.string({ required_error: validationMessages.required('Currency') }),
  totalRounds: poolNumberValidation('Total Rounds'),
  upcomingRound: z.string().optional(),
  startTime: z.date({ required_error: validationMessages.required('Start time') }),
  endTime: z.date({ required_error: validationMessages.required('End time') }),
  ticketPrice: priceValidation('Ticket Price'),
  match1: poolNumberValidation('Match 1'),
  match2: poolNumberValidation('Match 2'),
  match3: poolNumberValidation('Match 3'),
  match4: poolNumberValidation('Match 4'),
});

export type PoolSchema = z.infer<typeof poolSchema>;
