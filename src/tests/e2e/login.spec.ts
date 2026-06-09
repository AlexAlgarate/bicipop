import { expect, test } from '@playwright/test';

import { routes } from '@/config/routes';

import { GLOBAL_TEST_USER } from './helpers';

test.describe('User login', () => {
  test('Should render login page', async ({ page }) => {
    await page.goto(routes.auth.login);

    await expect(page.getByRole('heading', { name: 'Log in to BiciPop' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
  });

  test('Should log in with valid credentials', async ({ page }) => {
    await page.goto(routes.auth.login);

    await page.getByLabel('Email').fill(GLOBAL_TEST_USER.email);
    await page.getByLabel('Password').fill(GLOBAL_TEST_USER.password);
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page).toHaveURL(routes.home);
  });

  test('Should show error with invalid credentials', async ({ page }) => {
    await page.goto(routes.auth.login);

    await page.getByLabel('Email').fill('nonexistent@example.com');
    await page.getByLabel('Password').fill('WrongPassword123!');
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });

  test('Should have link to register page', async ({ page }) => {
    await page.goto(routes.auth.login);

    const signupLink = page.getByRole('link', { name: 'Signup here' });
    await expect(signupLink).toBeVisible();
    await expect(signupLink).toHaveAttribute('href', routes.auth.register);
  });

  test('Should navigate to register page from login', async ({ page }) => {
    await page.goto(routes.auth.login);

    await page.getByRole('link', { name: 'Signup here' }).click();

    await expect(page).toHaveURL(routes.auth.register);
    await expect(
      page.getByRole('heading', { name: 'Register on the platform' })
    ).toBeVisible();
  });
});
