import { z } from 'zod';

export const StringToRequiredIntegerSchema = z
  .string()
  .regex(/^\d+$/)
  .transform((value) => (value ? Number(value) : undefined))
  .pipe(z.number().int().nonnegative());
