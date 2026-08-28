import 'dotenv/config';
import { z } from 'zod';

/**
 * El servidor no arranca con una configuracion incompleta: es preferible
 * fallar aqui, con un mensaje claro, que descubrirlo en la primera peticion.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  MONGO_URL: z.string().min(1, 'MONGO_URL es obligatoria'),
  SECRET_KEY: z
    .string()
    .min(32, 'SECRET_KEY debe tener al menos 32 caracteres'),
  JWT_EXPIRES_IN: z.string().default('2h'),
  /** Origenes permitidos por CORS, separados por comas. */
  CORS_ORIGIN: z.string().default('http://localhost:4200'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const detail = parsed.error.issues
    .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
    .join('\n');
  throw new Error(`Configuracion de entorno invalida:\n${detail}`);
}

export const env = parsed.data;

export const corsOrigins = env.CORS_ORIGIN.split(',')
  .map((o) => o.trim())
  .filter(Boolean);
