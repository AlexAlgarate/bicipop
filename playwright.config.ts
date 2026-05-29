import path from 'path';

import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

export default defineConfig({
  testDir: './src/tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /global\.setup\.ts/,
    },
    {
      name: 'chromium-authenticated',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './playwright/.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: [
        '**/global.setup.ts',
        '**/helpers.ts',
        '**/register.spec.ts',
        '**/login.spec.ts',
        '**/auth.spec.ts',
      ],
    },
    {
      name: 'chromium-anonymous',
      use: {
        ...devices['Desktop Chrome'],
      },
      dependencies: ['setup'],
      testMatch: ['**/register.spec.ts', '**/login.spec.ts', '**/auth.spec.ts'],
    },
  ],
  webServer: {
    command: 'dotenv -e .env.test -- next dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
