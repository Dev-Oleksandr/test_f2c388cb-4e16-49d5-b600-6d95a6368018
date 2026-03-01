import { z } from 'zod';
import { StringToRequiredIntegerSchema } from '../../common/schemas/string-to-required-integer.schema.js';
import { TrimmedStringSchema } from '../../common/schemas/trimmed-string.schema.js';

const envSchema = z.object({
  PORT: StringToRequiredIntegerSchema,

  DATABASE_HOST: TrimmedStringSchema,
  DATABASE_NAME: TrimmedStringSchema,
  DATABASE_USER: TrimmedStringSchema,
  DATABASE_PORT: StringToRequiredIntegerSchema,

  DATABASE_PASSWORD: TrimmedStringSchema,
  BIND_DATABASE_PORT: StringToRequiredIntegerSchema,

  PROBATION_API_BASE_URL: TrimmedStringSchema,
  PROBATION_API_KEY: TrimmedStringSchema,
});

export type AppConfig = z.infer<typeof envSchema>;

export function validateConfig(config: Record<string, unknown>): AppConfig {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    throw new Error(`Invalid environment variables: ${result.error}`);
  }

  return result.data;
}
