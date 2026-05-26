import { expect, test } from '@playwright/test';

import { routes } from '@/config/routes';

test('Debe mostrar el título y el botón de registro en la página', async ({ page }) => {
  await page.goto(routes.auth.register);

  await expect(page.getByRole('button', { name: 'Sign up' })).toBeVisible();
});

test('Debe rellenar el formulario de registro y enviarlo', async ({ page }) => {
  await page.goto(routes.auth.register);

  await page.getByLabel('Name').fill('testuser');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Enter your password').fill('Password123.');
  await page.getByLabel('Confirm your password').fill('Password123.');
  await page.getByRole('button', { name: 'Sign up' }).click();

  await page.waitForLoadState('networkidle');
});
