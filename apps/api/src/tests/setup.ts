import 'dotenv/config';
import 'reflect-metadata';

import { Application } from 'express';
import { container } from '@di/container';
import { registerInfrastructure } from '@di/infrastructure-bindings';
import { registerUseCases } from '@di/usecase-bindings';
import { prisma } from '@infrastructure/prisma/client';
import { createApp } from '@ui/api';

export const TEST_EMAIL_PREFIX = 'authtest+';
export const testPrisma = prisma;

let testApp: Application | null = null;

beforeAll(async () => {
  container.unbindAll();
  registerInfrastructure();
  registerUseCases();

  testApp = createApp();
  await prisma.$connect();
}, 120000);

export const getTestApp = (): Application => {
  if (!testApp) {
    throw new Error('Test app has not been initialized. Ensure setup.ts ran before tests.');
  }
  return testApp;
};

afterEach(async () => {
  await prisma.favorite.deleteMany({
    where: {
      user: {
        email: { endsWith: '@example.com' },
      },
    },
  });
  await prisma.product.deleteMany({
    where: {
      user: {
        email: { endsWith: '@example.com' },
      },
    },
  });
  await prisma.user.deleteMany({
    where: {
      email: { endsWith: '@example.com' },
    },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
  container.unbindAll();
});
