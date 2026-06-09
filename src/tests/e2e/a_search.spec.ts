import { expect, test } from '@playwright/test';

import { routes } from '@/config/routes';

import { TEST_PRODUCTS } from './helpers';

test.describe('Search and filters', () => {
  test('Should render search page', async ({ page }) => {
    await page.goto(routes.search);

    await expect(page.getByRole('heading', { name: 'Search Results' })).toBeVisible();
    await expect(page.getByText('Filters')).toBeVisible();
    await expect(page.getByLabel('Location')).toBeVisible();
    await expect(page.getByLabel('Category')).toBeVisible();
  });

  test('Should render search page from "Start Exploring" button in home page', async ({
    page,
  }) => {
    await page.goto(routes.home);

    await page.getByRole('link', { name: 'Start Exploring' }).click();

    await expect(page).toHaveURL(routes.search);

    await expect(page.getByText('Filters')).toBeVisible();
    await expect(page.getByLabel('Location')).toBeVisible();
    await expect(page.getByLabel('Category')).toBeVisible();
  });

  test('Should render search page from navbar', async ({ page }) => {
    await page.goto(routes.home);

    await page.getByLabel('Search').click();

    await expect(page).toHaveURL(routes.search);

    await expect(page.getByText('Filters')).toBeVisible();
    await expect(page.getByLabel('Location')).toBeVisible();
    await expect(page.getByLabel('Category')).toBeVisible();
  });

  test('Should search by keyword', async ({ page }) => {
    await page.goto(routes.search);

    await page.getByPlaceholder('Search products...').fill('Canyon');
    await page.getByRole('button', { name: 'Apply' }).click();

    await expect(page.getByText(TEST_PRODUCTS.CANYON_AEROROAD.title)).toBeVisible();
  });

  test('Should show no results for non-existent product', async ({ page }) => {
    await page.goto(routes.search);

    await page.getByPlaceholder('Search products...').fill('xyzzynonExistent');
    await page.getByRole('button', { name: 'Apply' }).click();

    await expect(page.getByText('No products found')).toBeVisible();
  });

  test('Should filter by category', async ({ page }) => {
    await page.goto(routes.search);

    await page.locator('#category').selectOption('carretera');
    await page.getByRole('button', { name: 'Apply' }).click();

    await expect(page.getByText(TEST_PRODUCTS.CANYON_AEROROAD.title)).toBeVisible();
  });

  test('Should filter by price range', async ({ page }) => {
    await page.goto(routes.search);

    await page.getByPlaceholder('Min').fill('2000');
    await page.getByPlaceholder('Max').fill('5000');
    await page.getByRole('button', { name: 'Apply' }).click();

    await expect(page.getByText(TEST_PRODUCTS.CANYON_AEROROAD.title)).toBeVisible();
  });

  test('Should clear filters', async ({ page }) => {
    await page.goto(routes.search);

    await page.getByPlaceholder('Search products...').fill('Canyon');
    await page.getByRole('button', { name: 'Apply' }).click();

    await expect(page.getByText(TEST_PRODUCTS.CANYON_AEROROAD.title)).toBeVisible();

    await page.getByRole('button', { name: 'Clear' }).click();

    await expect(page).toHaveURL(routes.search);
  });

  test('Should filter by location', async ({ page }) => {
    await page.goto(routes.search);

    await page.locator('#location').fill('Madrid');
    await page.getByRole('button', { name: 'Apply' }).click();

    await expect(page.getByText(TEST_PRODUCTS.CANYON_AEROROAD.title)).toBeVisible();
    await expect(page.getByText(TEST_PRODUCTS.MMR_RAKISH.title)).not.toBeVisible();
  });

  test('Should show heading reflecting search query', async ({ page }) => {
    await page.goto(routes.search);

    await page.getByPlaceholder('Search products...').fill('Canyon');
    await page.getByRole('button', { name: 'Apply' }).click();

    await expect(
      page.getByRole('heading', { name: /Results for "Canyon"/ })
    ).toBeVisible();
  });

  test('Should filter by category and price range combined', async ({ page }) => {
    await page.goto(routes.search);

    await page.locator('#category').selectOption('carretera');
    await page.getByPlaceholder('Min').fill('2000');
    await page.getByPlaceholder('Max').fill('5000');
    await page.getByRole('button', { name: 'Apply' }).click();

    await expect(page.getByText(TEST_PRODUCTS.CANYON_AEROROAD.title)).toBeVisible();
    await expect(page.getByText(TEST_PRODUCTS.CANNONDALE_CAAD.title)).toBeVisible();
    await expect(page.getByText(TEST_PRODUCTS.MMR_RAKISH.title)).not.toBeVisible();
  });

  test('Should render back to home link', async ({ page }) => {
    await page.goto(routes.search);

    await expect(page.getByRole('link', { name: /Back to home/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Back to home/ })).toHaveAttribute(
      'href',
      '/'
    );
  });
});
