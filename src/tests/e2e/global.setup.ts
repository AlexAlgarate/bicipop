import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

import { test as setup } from '@playwright/test';

export const STORAGE_STATE = path.join(__dirname, '../../../playwright/.auth/user.json');

setup('Global Setup: Seed database and authenticate', async ({ page, baseURL }) => {
  console.log('--- START GLOBAL SETUP ---');

  execSync('npx dotenv -e .env.test -- npx tsx ./src/tests/e2e/seed.ts', {
    stdio: 'inherit',
  });

  const testUserEmail = 'global.testuser@example.com';
  const testUserPassword = 'Password1,.-';

  const loginUrl = baseURL ? `${baseURL}/login` : 'http://localhost:3000/login';
  const homeUrl = baseURL ? `${baseURL}/` : 'http://localhost:3000/';

  await page.goto(loginUrl);

  await page.getByLabel('Email').fill(testUserEmail);
  await page.getByLabel('Password').fill(testUserPassword);
  await page.getByRole('button', { name: 'Log in' }).click();

  await page.waitForURL(homeUrl);

  fs.mkdirSync(path.dirname(STORAGE_STATE), { recursive: true });

  await page.context().storageState({ path: STORAGE_STATE });

  console.log('--- END GLOBAL SETUP ---\n');
});
