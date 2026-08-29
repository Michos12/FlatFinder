import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { env } from './config/env.js';

async function main(): Promise<void> {
  await connectDatabase();
  console.log('MongoDB connected');

  const server = createApp().listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
  });

  // Graceful shutdown: stop accepting connections and release the database
  // before exiting, so deploys do not leave sockets hanging.
  const shutdown = (signal: string) => {
    console.log(`${signal} received, shutting down...`);
    server.close(() => {
      void disconnectDatabase().then(() => process.exit(0));
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((error) => {
  console.error('Could not start the server:', error);
  process.exit(1);
});
