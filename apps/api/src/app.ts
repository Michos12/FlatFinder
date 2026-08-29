import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { corsOrigins, env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { flatRouter } from './modules/flats/flat.routes.js';
import { userRouter } from './modules/users/user.routes.js';

/**
 * Construye la aplicación de Express sin abrir ningún puerto. Separarla de
 * server.ts permite montarla en los tests de integración con supertest.
 */
export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  // El navegador debe poder leer la respuesta, pero solo desde los orígenes
  // declarados: antes cors() estaba abierto a cualquiera.
  app.use(cors({ origin: corsOrigins, credentials: true }));
  app.use(express.json({ limit: '100kb' }));

  // Límite global holgado, pensado contra el abuso accidental.
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
    }),
  );

  // Límite mucho más estricto en login y registro, que son las rutas que
  // interesan a un ataque de fuerza bruta.
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: env.NODE_ENV === 'test' ? 1000 : 10,
    skipSuccessfulRequests: true,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  });
  app.use('/api/users/login', authLimiter);
  app.use('/api/users/register', authLimiter);

  app.get('/api/health', (_req, res) => {
    res.json({ success: true, data: { status: 'ok', uptime: process.uptime() } });
  });

  app.use('/api/users', userRouter);
  app.use('/api/flats', flatRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
