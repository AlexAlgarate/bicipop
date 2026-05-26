import path from 'path';

import dotenv from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@/generated/client/client';

dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

const createPrismaClient = (): PrismaClient => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in the environment variables.');
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
};

const global = globalThis as unknown as {
  prismaClient?: PrismaClient;
};

export const getPrismaClient = (): PrismaClient => {
  if (!global.prismaClient) {
    global.prismaClient = createPrismaClient();
  }
  return global.prismaClient;
};

export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    return getPrismaClient()[prop as keyof PrismaClient];
  },
});

export default prisma;
