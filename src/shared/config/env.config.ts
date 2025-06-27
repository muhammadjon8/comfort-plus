import { z } from 'zod';

const envConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive(),
  DATABASE_USER: z.string().min(1, 'DATABASE_USER is required'),
  DATABASE_NAME: z.string().min(1, 'DATABASE_NAME is required'),
  DATABASE_HOST: z.string().min(1, 'DATABASE_HOST is required'),
  DATABASE_URL: z.string().url(),
  DATABASE_PASSWORD: z.string().min(1, 'DATABASE_PASSWORD is required'),

  SUPER_ADMIN_EMAIL: z.string().email().min(1, 'SUPER_ADMIN_EMAIL is required'),
  SUPER_ADMIN_PASSWORD: z.string().min(1, 'SUPER_ADMIN_PASSWORD is required'),
  SUPER_ADMIN_FIRST_NAME: z.string().min(1, 'SUPER_ADMIN_FIRST_NAME is required'),
  SUPER_ADMIN_LAST_NAME: z.string().min(1, 'SUPER_ADMIN_LAST_NAME is required'),
  SUPER_ADMIN_PHONE_NUMBER: z.string().optional(),

  JWT_ACCESS_TOKEN_SECRET: z.string().min(1, 'JWT_ACCESS_TOKEN_SECRET is required'),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string().default('1h'),
  JWT_REFRESH_TOKEN_SECRET: z.string().min(1, 'JWT_REFRESH_TOKEN_SECRET is required'),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
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
