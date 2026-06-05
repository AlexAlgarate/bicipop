import { expect, test } from '@playwright/test';

import { routes } from '@/config/routes';

import { TEST_PRODUCTS } from '../helpers';

test.describe.serial('Messages page', () => {
  test('Should render empty messages state', async ({ page }) => {
    await page.goto(routes.profile.messages);

    await expect(
      page.getByRole('heading', { name: 'Messages', exact: true })
    ).toBeVisible();

    await expect(page.getByText('No messages yet')).toBeVisible();
    await expect(
      page.getByText('When you contact a seller or receive a message')
    ).toBeVisible();

    // total: 0 conversations
    await expect(page.getByText('0').first()).toBeVisible();
  });

  test('Should start a conversation from product detail and render 1 conversation in profile/messages', async ({
    page,
  }) => {
    await page.goto(routes.products.detail(TEST_PRODUCTS.MMR_RAKISH.id));

    await page.getByRole('button', { name: 'Contact Seller' }).click();

    await page.waitForURL(/\/messages\//);

    await page
      .getByPlaceholder('Write a message...')
      .fill('Hello, this is an E2E test message');
    await page.getByLabel('Send message').click();

    await page.getByRole('link', { name: 'Back to messages' }).click({ delay: 200 });
    await expect(page).toHaveURL(routes.profile.messages);
    await expect(page.getByText('1').first()).toBeVisible();
  });

  test('Should navigate to existing conversation and send a new message', async ({
    page,
  }) => {
    await page.goto(routes.profile.messages);

    await page.getByText(TEST_PRODUCTS.MMR_RAKISH.title).click();

    await expect(page.getByText('Hello, this is an E2E test message')).toBeVisible();

    const newMessage = 'Yes, it is still available!';
    await page.getByPlaceholder('Write a message...').fill(newMessage);
    await page.getByLabel('Send message').click();

    await expect(page.getByText(newMessage)).toBeVisible();
  });

  test('Should remove an existing conversation', async ({ page }) => {
    await page.goto(routes.profile.messages);

    await expect(page.getByText('1').first()).toBeVisible();

    await page.getByRole('button', { name: 'Delete conversation' }).click();

    await page.getByRole('button', { name: 'Delete', exact: true }).click();

    await expect(page.getByText('0').first()).toBeVisible();
  });
});
