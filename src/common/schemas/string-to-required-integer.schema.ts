import { z } from 'zod';
import { TrimmedStringSchema } from './trimmed-string.schema.js';

export const StringToRequiredIntegerSchema = TrimmedStringSchema.regex(/^\d+$/)
  .transform((value) => Number(value))
  .pipe(z.number().int().nonnegative());
