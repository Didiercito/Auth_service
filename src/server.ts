import { config } from 'dotenv';
config();

import app from './app';
import { initializeDatabase, closeDatabase } from './config/data-source';
import { eventPublisher } from './infrastructure/api/dependencies/dependencies';
import { runSeeds } from './config/seed/seed';

const PORT = parseInt(process.env.AUTH_API_PORT || '3001');

const startServer = async () => {
  try {
    console.log('🚀 Starting Auth-User Service...');
    console.log('📦 Connecting to database...');
    await initializeDatabase();
    console.log('✅ Database connected successfully');

    console.log('🌱 Running database seeds...');
    await runSeeds();
    console.log('✅ Seeds executed successfully');

    console.log('📨 Connecting to RabbitMQ...');
    console.log('--- DEBUGGING RABBITMQ ---');
    await eventPublisher.connect();
    
    app.listen(PORT, () => {
      console.log(`Server running in port: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Closing server gracefully...`);

  try {
    await closeDatabase();
    console.log('✅ Database connection closed');

    await eventPublisher.close();
    console.log('✅ RabbitMQ connection closed');

    console.log('✅ Server closed gracefully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during graceful shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('Unhandled Rejection');
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  gracefulShutdown('Uncaught Exception');
});

startServer();