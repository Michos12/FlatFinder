import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { env } from './config/env.js';

async function main(): Promise<void> {
  await connectDatabase();
  console.log('MongoDB conectado');

  const server = createApp().listen(env.PORT, () => {
    console.log(`API escuchando en http://localhost:${env.PORT} (${env.NODE_ENV})`);
  });

  // Cierre ordenado: se deja de aceptar conexiones y se suelta la base de
  // datos antes de salir, para no dejar sockets colgando en el despliegue.
  const shutdown = (signal: string) => {
    console.log(`${signal} recibido, cerrando...`);
    server.close(() => {
      void disconnectDatabase().then(() => process.exit(0));
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((error) => {
  console.error('No se pudo arrancar el servidor:', error);
  process.exit(1);
});
