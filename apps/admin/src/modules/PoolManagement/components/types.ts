import { validationMessages } from '@/lib/validations/validation.utility';
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
  pageSizes?: number;
  sort?: string;
}

const createNumberValidation = (fieldName: string) =>
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

export const poolCreateSchema = z.object({
  name: z.string({ required_error: validationMessages.required('Name')}).trim().refine((data) => {
    if (!data) return false;
    return true;
  }, `Name field is required`),
  sequency: createNumberValidation('Sequency'),
  currency: z.string({ required_error: validationMessages.required('Currency') }),
  totalRounds: createNumberValidation('Total Rounds'),
  startTime: z.date({ required_error: validationMessages.required('Start time') }),
  endTime: z.date().optional(),
  ticketPrice: createNumberValidation('Ticket Price'),
  match1: createNumberValidation('Match 1'),
  match2: createNumberValidation('Match 2'),
  match3: createNumberValidation('Match 3'),
  match4: createNumberValidation('Match 4'),
});

export type PoolCreateSchema = z.infer<typeof poolCreateSchema>;
