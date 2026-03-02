import { z } from 'zod';

export const DateRangeSchema = z
  .object({
    fromDate: z.coerce.date(),
    toDate: z.coerce.date(),
  })
  .refine(({ fromDate, toDate }) => fromDate < toDate, {
    message: 'fromDate must be less than toDate',
  });
