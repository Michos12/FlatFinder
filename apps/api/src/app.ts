import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { corsOrigins, env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { flatRouter } from './modules/flats/flat.routes.js';
import { userRouter } from './modules/users/user.routes.js';

/**
 * Builds the Express app without opening a port. Keeping it apart from
 * server.ts is what lets the integration tests mount it with supertest.
 */
export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  // The browser must be able to read the response, but only from the declared
  // origins: cors() used to be wide open to anyone.
  app.use(cors({ origin: corsOrigins, credentials: true }));
  app.use(express.json({ limit: '100kb' }));

  // Generous global limit, aimed at accidental abuse rather than attacks.
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
    }),
  );

  // Much stricter limit on login and register, the routes a brute-force
  // attack actually cares about.
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
