import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Initialize Prisma Client with error handling
 * Uses singleton pattern to prevent multiple instances in development
 */
function createPrismaClient(): PrismaClient {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  } catch (error) {
    console.error('[PRISMA] Failed to initialize Prisma Client:', error);
    console.error('[PRISMA] Make sure Prisma Client is generated: npx prisma generate');
    throw error;
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown handling
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect().catch((error) => {
      console.error('[PRISMA] Error disconnecting:', error);
    });
  });
}
