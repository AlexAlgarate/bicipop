import path from 'path';

import dotenv from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

import { PrismaClient } from '@/generated/client/client';

const createPrismaClient = (): PrismaClient => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in the environment variables.');
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
};

const getPrismaClient = (): PrismaClient => {
  if (!global.prismaClient) {
    global.prismaClient = createPrismaClient();
  }
  return global.prismaClient;
};

const global = globalThis as unknown as {
  prismaClient?: PrismaClient;
  [key: string]: unknown;
};

export const prisma = getPrismaClient();

export default prisma;
