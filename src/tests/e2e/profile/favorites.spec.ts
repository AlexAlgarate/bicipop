import { expect, test } from '@playwright/test';

import { routes } from '@/config/routes';

import { GLOBAL_TEST_USER, TEST_PRODUCTS } from '../helpers';

test.describe.serial('Favorites', () => {
  test('Should navigate to favorites from navbar', async ({ page }) => {
    await page.goto(routes.home);

    const avatarButton = page
      .locator('header button')
      .filter({ hasText: GLOBAL_TEST_USER.username });
    await avatarButton.click();
    await page.getByRole('link', { name: 'Favorites', exact: true }).click();

    await expect(page).toHaveURL(routes.profile.favorites);
  });

  test('Should show empty favorites page', async ({ page }) => {
    await page.goto(routes.profile.favorites);

    await expect(page.getByText('No favorites yet')).toBeVisible();
  });

  test('Should add a product to favorites from detail page', async ({ page }) => {
    await page.goto(routes.products.detail(TEST_PRODUCTS.MMR_RAKISH.id));

    const favButton = page.getByLabel('Add to favorites');
    await expect(favButton).toBeVisible();
    await favButton.click();

    await expect(page.getByLabel('Remove from favorites')).toBeVisible();
  });

  test('Should add a product to favorites from home page', async ({ page }) => {
    await page.goto(routes.home);

    // previous state
    await page.getByLabel('Remove from favorites').click();
    await page.getByLabel('Add to favorites').click();

    await expect(page.getByLabel('Remove from favorites')).toBeVisible();
  });

  test('Should show favorited product on favorites page', async ({ page }) => {
    await page.goto(routes.profile.favorites);

    await expect(page.getByText(TEST_PRODUCTS.MMR_RAKISH.title)).toBeVisible();
  });

  test('Should remove a product from favorites', async ({ page }) => {
    await page.goto(routes.profile.favorites);

    await page.getByLabel('Remove from favorites').click();

    await expect(page.getByLabel('Add to favorites')).toBeVisible();
    await expect(page.getByText('No favorites yet')).toBeVisible();
  });
});
