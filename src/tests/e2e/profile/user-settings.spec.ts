import { expect, test } from '@playwright/test';

import { routes } from '@/config/routes';

import { GLOBAL_TEST_USER } from '../helpers';

test.describe.serial('Profile and Settings', () => {
  test('Should render settings page', async ({ page }) => {
    await page.goto(routes.profile.settings);

    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(
      page.getByText(`Welcome back, ${GLOBAL_TEST_USER.username}`)
    ).toBeVisible();
    await expect(page.getByText('Profile')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Password' })).toBeVisible();
    await expect(page.getByText('Danger zone')).toBeVisible();
  });

  test('Should navigate to settings from navbar', async ({ page }) => {
    await page.goto(routes.home);

    const avatarButton = page
      .locator('header button')
      .filter({ hasText: GLOBAL_TEST_USER.username });
    await avatarButton.click();
    await page.getByRole('link', { name: 'Settings' }).click();

    await expect(page).toHaveURL(routes.profile.settings);
  });

  test('Should show profile edit form and cancel', async ({ page }) => {
    await page.goto(routes.profile.settings);

    const editButton = page.getByRole('button', { name: 'Edit' });
    await expect(editButton).toBeVisible();
    await editButton.click();

    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Current password')).toBeVisible();

    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();
  });

  test('Should show error when editing profile with wrong password', async ({
    page,
  }) => {
    await page.goto(routes.profile.settings);

    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByLabel('Username').fill('NewName');
    await page.getByLabel('Email').fill('new_email@example.com');
    await page.getByLabel('Current password').fill('WrongPassword123!');

    await page.getByRole('button', { name: 'Save changes' }).click();

    await expect(page.getByText('Incorrect password')).toBeVisible();
  });

  test('Should show change password form and cancel', async ({ page }) => {
    await page.goto(routes.profile.settings);

    await page.getByRole('button', { name: 'Change' }).click();

    await expect(page.getByLabel('Current password')).toBeVisible();
    await expect(page.getByLabel('New password')).toBeVisible();
    await expect(page.getByLabel('Confirm password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Update password' })).toBeVisible();

    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page.getByRole('button', { name: 'Change' })).toBeVisible();
  });

  test('Should show error when changing password with mismatched confirmation', async ({
    page,
  }) => {
    await page.goto(routes.profile.settings);

    await page.getByRole('button', { name: 'Change' }).click();
    await page.getByLabel('Current password').fill(GLOBAL_TEST_USER.password);
    await page.getByLabel('New password').fill('NewPassword1,');
    await page.getByLabel('Confirm password').fill('DifferentPassword1,');

    await page.getByRole('button', { name: 'Update password' }).click();

    await expect(page.getByText('Passwords do not match')).toBeVisible();
  });

  test('Should show delete account confirmation and cancel', async ({ page }) => {
    await page.goto(routes.profile.settings);

    await page.getByRole('button', { name: 'Delete account' }).click();

    await expect(page.getByText('This action is permanent')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();

    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page.getByRole('button', { name: 'Delete account' })).toBeVisible();
  });

  test('Should edit username and email', async ({ page }) => {
    await page.goto(routes.profile.settings);

    const editButton = page.getByRole('button', { name: 'Edit' });
    await expect(editButton).toBeVisible();
    await editButton.click();

    await page.getByLabel('Username').fill('NewName');
    await page.getByLabel('Email').fill('new_email@example.com');
    await page.getByLabel('Current password').fill(GLOBAL_TEST_USER.password);

    await page.getByRole('button', { name: 'Save changes' }).click();

    await expect(page.getByText('Welcome back, NewName')).toBeVisible();
  });

  test('Should change current password', async ({ page }) => {
    await page.goto(routes.profile.settings);

    await page.getByRole('button', { name: 'Change' }).click();

    await page.getByLabel('Current password').fill(GLOBAL_TEST_USER.password);
    await page.getByLabel('New password').fill('NewPassword1,');
    await page.getByLabel('Confirm password').fill('NewPassword1,');
    await page.getByRole('button', { name: 'Update password' }).click();

    await expect(page.getByRole('button', { name: 'Change' })).toBeVisible();
  });

  test('Should delete account and navigate to home page', async ({ page }) => {
    await page.goto(routes.profile.settings);

    await page.getByRole('button', { name: 'Delete account' }).click();

    await page.getByLabel('Password').fill('NewPassword1,');

    await page
      .getByRole('button', { name: 'Yes, delete my account' })
      .click({ delay: 200 });

    await expect(page).toHaveURL(routes.home);
  });
});
