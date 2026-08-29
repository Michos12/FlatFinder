import 'dotenv/config';
import { z } from 'zod';

/**
 * The server refuses to start on an incomplete configuration: better to fail
 * here, with a clear message, than to find out on the first request.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  MONGO_URL: z.string().min(1, 'MONGO_URL is required'),
  SECRET_KEY: z
    .string()
    .min(32, 'SECRET_KEY must be at least 32 characters long'),
  JWT_EXPIRES_IN: z.string().default('2h'),
  /** Comma-separated list of origins allowed by CORS. */
  CORS_ORIGIN: z.string().default('http://localhost:4200'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const detail = parsed.error.issues
    .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
    .join('\n');
  throw new Error(`Invalid environment configuration:\n${detail}`);
}

export const env = parsed.data;

export const corsOrigins = env.CORS_ORIGIN.split(',')
  .map((o) => o.trim())
  .filter(Boolean);
