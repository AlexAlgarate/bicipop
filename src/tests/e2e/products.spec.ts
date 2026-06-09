import { expect, test } from '@playwright/test';

import { routes } from '@/config/routes';

import {
  createTestProductData,
  GLOBAL_TEST_USER,
  OTHER_TEST_USER,
  TEST_PRODUCTS,
} from './helpers';

test.describe('Product CRUD', () => {
  test.describe('Products page', () => {
    test('Should render hero section with title and CTAs', async ({ page }) => {
      await page.goto(routes.home);

      await expect(
        page.getByRole('heading', { name: 'Give your bicycle a second life.' })
      ).toBeVisible();
      await expect(
        page.getByText('The specialized marketplace for cyclists.')
      ).toBeVisible();
      await expect(page.getByRole('link', { name: 'Sell Something' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Start Exploring' })).toBeVisible();
    });

    test('Should render product cards with seed product titles', async ({ page }) => {
      await page.goto(routes.home);

      await expect(page.getByText(TEST_PRODUCTS.CANYON_AEROROAD.title)).toBeVisible();
      await expect(page.getByText(TEST_PRODUCTS.MMR_RAKISH.title)).toBeVisible();
      await expect(page.getByText(TEST_PRODUCTS.CANNONDALE_CAAD.title)).toBeVisible();
    });

    test('Should show formatted prices on product cards', async ({ page }) => {
      await page.goto(routes.home);

      await expect(
        page.getByText(`${TEST_PRODUCTS.CANYON_AEROROAD.price} €`)
      ).toBeVisible();
      await expect(page.getByText(`${TEST_PRODUCTS.MMR_RAKISH.price} €`)).toBeVisible();
      await expect(
        page.getByText(`${TEST_PRODUCTS.CANNONDALE_CAAD.price} €`)
      ).toBeVisible();
    });

    test('Should show seller name on each product card', async ({ page }) => {
      await page.goto(routes.home);

      const soldBy = page.getByText('Sold by');
      await expect(soldBy.first()).toBeVisible();
      await expect(page.getByText(GLOBAL_TEST_USER.username).first()).toBeVisible();
      await expect(page.getByText(OTHER_TEST_USER.username).first()).toBeVisible();
    });

    test('Should navigate to product detail page on card click', async ({ page }) => {
      await page.goto(routes.home);

      await page.getByText(TEST_PRODUCTS.CANYON_AEROROAD.title).click();

      await expect(page).toHaveURL(
        routes.products.detail(TEST_PRODUCTS.CANYON_AEROROAD.id)
      );

      await expect(page).toHaveURL(
        routes.products.detail(TEST_PRODUCTS.CANYON_AEROROAD.id)
      );
    });

    test('Should have View all link that navigates to search', async ({ page }) => {
      await page.goto(routes.home);

      await page.getByRole('link', { name: 'View all' }).click();

      await expect(page).toHaveURL(routes.search);
    });

    test('Should navigate to /search page when "Start Exploring" button is clicked', async ({
      page,
    }) => {
      await page.goto(routes.home);

      await page.getByRole('link', { name: 'Start Exploring' }).click();

      await expect(page).toHaveURL(routes.search);
      expect(page.getByRole('heading', { name: 'Search Results' }));
    });

    test('Should navigate to /upload page when "Sell Something" button is clicked', async ({
      page,
    }) => {
      await page.goto(routes.home);

      await page.getByRole('link', { name: 'Sell Something' }).click();

      await expect(page).toHaveURL(routes.products.upload);
      expect(page.getByRole('heading', { name: 'Upload Product' }));
    });
  });

  test.describe('Upload products', () => {
    test('Should render upload page', async ({ page }) => {
      await page.goto(routes.products.upload);

      await expect(page.getByRole('heading', { name: 'Upload Product' })).toBeVisible();
      await expect(page.getByLabel('Title')).toBeVisible();
      await expect(page.getByLabel('Description')).toBeVisible();
      await expect(page.getByLabel('Price (EUR)')).toBeVisible();
      await expect(page.getByLabel('Location')).toBeVisible();
      await expect(page.getByLabel('category')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Publish Product' })).toBeVisible();
    });

    test('Should show validation errors on upload with empty fields', async ({
      page,
    }) => {
      await page.goto(routes.products.upload);

      await page.getByRole('button', { name: 'Publish Product' }).click();

      await expect(page.getByText('There are errors in the form')).toBeVisible();
    });
  });

  test('Should upload a new product and it is rendered in home page', async ({
    page,
  }) => {
    const product = createTestProductData();

    await page.goto(routes.products.upload);

    await page.getByLabel('Title').fill(product.title);
    await page.getByLabel('Description').fill(product.description);
    await page.getByLabel('Price (EUR)').fill(String(product.price));
    await page.getByLabel('Location').fill(product.location);
    await page.locator('#categoryId').selectOption({ index: 1 });
    await page.locator('[name="imageUrl"]').fill(product.imageUrl);

    await page.getByRole('button', { name: 'Publish Product' }).click();

    await expect(page).toHaveURL(routes.home);

    expect(page.getByText(`${product.price} €`));
    await expect(page.getByText(product.title)).toBeVisible();
  });

  test('Should upload a new product and it is rendered in detail product page ', async ({
    page,
  }) => {
    const product = createTestProductData();

    await page.goto(routes.products.upload);

    await page.getByLabel('Title').fill(product.title);
    await page.getByLabel('Description').fill(product.description);
    await page.getByLabel('Price (EUR)').fill(String(product.price));
    await page.getByLabel('Location').fill(product.location);
    await page.locator('#categoryId').selectOption({ index: 1 });
    await page.locator('[name="imageUrl"]').fill(product.imageUrl);

    await page.getByRole('button', { name: 'Publish Product' }).click();

    await expect(page).toHaveURL(routes.home);

    await page.getByRole('link').filter({ hasText: product.title }).click();

    await expect(page).toHaveURL(/\/products\/.+/);
    await expect(page.getByRole('heading', { name: product.title })).toBeVisible();
    await expect(page.getByText(product.location)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Edit Product' })).toBeVisible();
  });

  test('Should see Contact Seller on another user product', async ({ page }) => {
    await page.goto(routes.products.detail(TEST_PRODUCTS.MMR_RAKISH.id));

    await expect(
      page.getByRole('link', {
        name: new RegExp(`^${OTHER_TEST_USER.username} Member since`),
      })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Contact Seller' })).toBeVisible();
  });
});
