import { z } from 'zod';

const envConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive(),
  DATABASE_USER: z.string().min(1, 'DATABASE_USER is required'),
  DATABASE_NAME: z.string().min(1, 'DATABASE_NAME is required'),
  DATABASE_HOST: z.string().min(1, 'DATABASE_HOST is required'),
  DATABASE_URL: z.string().url(),
  DATABASE_PASSWORD: z.string().min(1, 'DATABASE_PASSWORD is required'),
});

export type EnvConfig = z.infer<typeof envConfigSchema>;

export function validateEnvConfig(config: unknown): EnvConfig {
  const parsedConfig = envConfigSchema.safeParse(config);
  if (!parsedConfig.success) {
    const errors = parsedConfig.error.errors.map((err) => {
      return {
        field: err.path.join('.'),
        message: err.message,
      };
    });
    throw new Error(`Invalid environment configuration: ${JSON.stringify(errors, null, 2)}`);
  }
  return parsedConfig.data;
}
