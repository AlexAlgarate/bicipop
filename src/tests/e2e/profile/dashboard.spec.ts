import { expect, test } from '@playwright/test';

import { routes } from '@/config/routes';

import { GLOBAL_TEST_USER, TEST_PRODUCTS } from '../helpers';

test.describe.serial('Dashboard user products', () => {
  test('Should navigate to dashboard from navbar', async ({ page }) => {
    await page.goto(routes.home);

    const avatarButton = page
      .locator('header button')
      .filter({ hasText: GLOBAL_TEST_USER.username });
    await avatarButton.click();
    await page.getByRole('link', { name: 'My products', exact: true }).click();

    await expect(page).toHaveURL(routes.profile.dashboard);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('Should show current user products and stats', async ({ page }) => {
    await page.goto(routes.profile.dashboard);

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(
      page.getByText(
        `Welcome back, ${GLOBAL_TEST_USER.username}! Manage your listings here.`
      )
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Upload Product' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Your Products' })).toBeVisible();

    await expect(page.getByText('Total Products')).toBeVisible();
    await expect(page.getByText('Active')).toHaveCount(3);
    await expect(page.getByText('Reserved')).toBeVisible();
    await expect(page.getByText('Sold')).toBeVisible();

    await expect(
      page.getByText(TEST_PRODUCTS.CANYON_AEROROAD.title, { exact: true })
    ).toBeVisible();
    await expect(page.getByText('ACTIVE').first()).toBeVisible();
    await expect(
      page.getByText(TEST_PRODUCTS.CANNONDALE_CAAD.title, { exact: true })
    ).toBeVisible();
    await expect(page.getByText(TEST_PRODUCTS.MMR_RAKISH.title)).not.toBeVisible();
  });

  test('Should navigate to edit page from product actions', async ({ page }) => {
    await page.goto(routes.profile.dashboard);

    await page.getByRole('link', { name: 'Edit' }).first().click();

    await expect(page).toHaveURL(routes.products.edit(TEST_PRODUCTS.CANNONDALE_CAAD.id));
    await expect(page.getByRole('heading', { name: 'Edit Product' })).toBeVisible();
  });

  test('Should change product status from ACTIVE to RESERVED, from RESERVED to SOLD and from SOLD to ACTIVE', async ({
    page,
  }) => {
    await page.goto(routes.profile.dashboard);

    await expect(page.getByText('ACTIVE').first()).toBeVisible();
    await page.getByRole('button', { name: 'Change status' }).first().click();
    await page.getByRole('button', { name: 'Reserved' }).click();

    await expect(page.getByText('RESERVED').first()).toBeVisible();

    await page.getByRole('button', { name: 'Change status' }).first().click();
    await page.getByRole('button', { name: 'Sold' }).click();

    await expect(page.getByText('SOLD').first()).toBeVisible();

    await page.getByRole('button', { name: 'Change status' }).first().click();
    await page.getByRole('button', { name: 'Active' }).click();

    await expect(page.getByText('ACTIVE').first()).toBeVisible();
    await page.getByRole('button', { name: 'Change status' }).first().click();
    await expect(page.getByRole('button', { name: 'Active' })).toBeDisabled();
  });

  test('Should click on the rubbish button (delete product) and click on cancel', async ({
    page,
  }) => {
    await page.goto(routes.profile.dashboard);

    await page.getByRole('button', { name: 'Delete' }).first().click();
    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(
      page.getByText(TEST_PRODUCTS.CANYON_AEROROAD.title, { exact: true })
    ).toBeVisible();
  });

  test('Should click on the rubbish button and delete the product', async ({ page }) => {
    await page.goto(routes.profile.dashboard);
    await page
      .getByRole('link', { name: 'Edit' })
      .and(page.locator(`[href="${routes.products.edit(TEST_PRODUCTS.CANNONDALE_CAAD.id)}"]`))
      .locator('xpath=..')
      .getByRole('button', { name: 'Delete' })
      .click();
    await page.locator('#delete-confirm-modal').click();

    await expect(
      page.getByText(TEST_PRODUCTS.CANNONDALE_CAAD.title, { exact: true })
    ).not.toBeVisible();
  });
});
