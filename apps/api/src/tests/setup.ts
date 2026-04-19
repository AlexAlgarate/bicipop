import 'reflect-metadata';

import { environmentService } from '@infrastructure/services/environment-service';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../prisma/generated/client/client';
import { container } from '@di/container';
import { EMAIL_SERVICE } from '@di/tokens';

import { Application } from 'express';
import { registerTestBindings } from '@di/tests-bindings';
import { createApp } from '@ui/api';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in the environment variables.');
}
const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });

let testApp: Application;
beforeAll(async () => {
  environmentService.load();
  registerTestBindings();
  container.rebind(EMAIL_SERVICE).toConstantValue({
    sendEmailToSeller: vi.fn(),
  });
}, 120000);

export const getTestApp = (): Application => testApp;

afterEach(async () => {});

afterAll(async () => {});
