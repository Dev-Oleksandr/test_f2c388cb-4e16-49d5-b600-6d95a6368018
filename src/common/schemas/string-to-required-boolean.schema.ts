import { z } from 'zod';

export const StringToRequiredBooleanSchema = z
  .enum(['true', 'false'])
  .transform((value) => value === 'true')
  .pipe(z.boolean());
