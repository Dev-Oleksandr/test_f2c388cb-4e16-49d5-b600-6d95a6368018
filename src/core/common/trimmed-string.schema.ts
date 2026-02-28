import { z } from 'zod';

export const TrimmedStringSchema = z.string().trim();
