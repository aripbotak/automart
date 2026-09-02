import { PrismaClient } from '@prisma/client';
import config from './env.js';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: config.env === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (config.env !== 'production') {
  global.prisma = prisma;
}

export async function connectDB(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('📦 PostgreSQL Database connected successfully via Prisma ORM');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
}

export async function disconnectDB(): Promise<void> {
  await prisma.$disconnect();
}

export default prisma;
