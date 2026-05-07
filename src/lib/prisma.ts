import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  if (!process.env.DATABASE_URL) return undefined;
  try {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    const client = new PrismaClient({ adapter });
    // Explicitly connect to avoid "must call connect() before querying" error
    client.$connect().catch(() => {
      // Silently ignore connection errors at module load time
      // Errors will surface naturally when queries are made
    });
    return client;
  } catch {
    return undefined;
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
export const hasDatabase = !!prisma;

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}
