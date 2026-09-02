import { createApp } from './app.js';
import config from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';

async function bootstrap() {
  // Connect to Database
  await connectDB();

  const app = createApp();

  const server = app.listen(config.port, () => {
    console.log(`
  🚀 ===================================================
  🏎️  AutoMart E-Commerce Backend Service Active!
  📡  Environment: [${config.env}]
  🔗  Port:        ${config.port}
  🌐  Base URL:    http://localhost:${config.port}${config.apiPrefix}
  🩺  HealthCheck: http://localhost:${config.port}${config.apiPrefix}/health
  🛡️   Storage:     [${config.storageProvider.toUpperCase()}] Pipeline
  ======================================================
    `);
  });

  // Graceful Shutdown Handling
  const shutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
    server.close(async () => {
      console.log('HTTP server closed.');
      await disconnectDB();
      console.log('Database connections closed. Process terminating.');
      process.exit(0);
    });

    // Force close if graceful shutdown takes too long
    setTimeout(() => {
      console.error('⚠️ Forcefully terminating after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start backend server:', err);
  process.exit(1);
});
