import { expect, test } from '@playwright/test';

import { routes } from '@/config/routes';

import {
  GLOBAL_TEST_USER,
  createTestUserCredentials,
  createTestUserCredentialsWithInvalidPassword,
  createTestUserCredentialsWithInvalidPasswordMatch,
} from './helpers';

test.describe('User register', () => {
  test('Should render register page', async ({ page }) => {
    await page.goto(routes.auth.register);
    await expect(
      page.getByRole('heading', { name: 'Register on the platform' })
    ).toBeVisible();
    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Enter your password')).toBeVisible();
    await expect(page.getByLabel('Confirm your password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign up' })).toBeVisible();
  });

  test('Should register a new user successfuly', async ({ page }) => {
    const user = createTestUserCredentials();

    await page.goto(routes.auth.register);

    await page.getByLabel('Name').fill(user.name);
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Enter your password').fill(user.password);
    await page.getByLabel('Confirm your password').fill(user.confirmPassword);
    await page.getByRole('button', { name: 'Sign up' }).click();

    await expect(page).toHaveURL('/');
  });

  test('Should show validation errors when submitting empty form', async ({ page }) => {
    await page.goto(routes.auth.register);

    await page.getByRole('button', { name: 'Sign up' }).click();

    await expect(page.getByText('Check wrong fields')).toBeVisible();
  });

  test('Should show field errors for empty name', async ({ page }) => {
    const user = createTestUserCredentials();

    await page.goto(routes.auth.register);

    await page.getByLabel('Name').fill('');
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Enter your password').fill(user.password);
    await page.getByLabel('Confirm your password').fill(user.confirmPassword);
    await page.getByRole('button', { name: 'Sign up' }).click();

    await expect(page.getByText('Username must be at least 3 characters')).toBeVisible();
  });

  test('Should show field error for invalid email', async ({ page }) => {
    const user = createTestUserCredentials();

    await page.goto(routes.auth.register);

    await page.getByLabel('Name').fill(user.name);
    await page.getByLabel('Email').fill('not-an-email');
    await page.getByLabel('Enter your password').fill(user.password);
    await page.getByLabel('Confirm your password').fill(user.confirmPassword);
    await page.getByRole('button', { name: 'Sign up' }).click();

    await expect(page.getByText('Invalid email format')).toBeVisible();
  });

  test('Should show validation error when password is too short', async ({ page }) => {
    const user = createTestUserCredentialsWithInvalidPassword();

    await page.goto(routes.auth.register);

    await page.getByLabel('Name').fill(user.name);
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Enter your password').fill(user.password);
    await page.getByLabel('Confirm your password').fill(user.confirmPassword);
    await page.getByRole('button', { name: 'Sign up' }).click();

    await expect(
      page.getByText('Too small: expected string to have >=3 characters')
    ).toBeVisible();
  });

  test('Should show error when passwords do not match', async ({ page }) => {
    const user = createTestUserCredentialsWithInvalidPasswordMatch();

    await page.goto(routes.auth.register);

    await page.getByLabel('Name').fill('testuser');
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Enter your password').fill(user.password);
    await page.getByLabel('Confirm your password').fill(user.confirmPassword);
    await page.getByRole('button', { name: 'Sign up' }).click();

    await expect(page.getByText('Passwords do not match')).toBeVisible();
  });

  test('Should show error when registering with an existing email', async ({ page }) => {
    const user = createTestUserCredentials();

    await page.goto(routes.auth.register);

    await page.getByLabel('Name').fill(user.name);
    await page.getByLabel('Email').fill(GLOBAL_TEST_USER.email);
    await page.getByLabel('Enter your password').fill(user.password);
    await page.getByLabel('Confirm your password').fill(user.confirmPassword);
    await page.getByRole('button', { name: 'Sign up' }).click();

    await expect(page.getByText('Credentials invalid')).toBeVisible();
  });

  test('Should show password rules when typing a weak password', async ({ page }) => {
    await page.goto(routes.auth.register);

    await page.getByLabel('Enter your password').fill('ab');

    await expect(page.getByText('Uppercase, lowercase and numbers')).toBeVisible();
  });

  test('Should have link to login page', async ({ page }) => {
    await page.goto(routes.auth.register);

    const loginLink = page.getByRole('link', { name: 'Log in' });
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toHaveAttribute('href', routes.auth.login);
  });

  test('Should navigate to login page from register', async ({ page }) => {
    await page.goto(routes.auth.register);

    await page.getByRole('link', { name: 'Log in' }).click();

    await expect(page).toHaveURL(routes.auth.login);
    await expect(page.getByRole('heading', { name: 'Log in to BiciPop' })).toBeVisible();
  });

  test('Should preserve form fields after failed submission', async ({ page }) => {
    const userName = 'testuser';
    const userEmail = 'testuser@example.com';

    await page.goto(routes.auth.register);

    await page.getByLabel('Name').fill(userName);
    await page.getByLabel('Email').fill(userEmail);
    await page.getByLabel('Enter your password').fill('12');
    await page.getByLabel('Confirm your password').fill('12');
    await page.getByRole('button', { name: 'Sign up' }).click();

    await expect(page.getByLabel('Name')).toHaveValue(userName);
    await expect(page.getByLabel('Email')).toHaveValue(userEmail);
  });
});
