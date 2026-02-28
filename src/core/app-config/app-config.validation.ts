import { z } from 'zod';

const envSchema = z.object({});

export type AppConfig = z.infer<typeof envSchema>;

export function validateConfig(config: Record<string, unknown>): AppConfig {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    throw new Error(`Invalid environment variables: ${result.error}`);
  }

  return result.data;
}
