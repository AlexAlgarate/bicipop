import { expect, test } from '@playwright/test';

import { routes } from '@/config/routes';

import { GLOBAL_TEST_USER, TEST_PRODUCTS } from '../helpers';

test.describe.serial('Messages page', () => {
  let conversationId: string;

  test('Should navigate to messages from navbar', async ({ page }) => {
    await page.goto(routes.home);

    const avatarButton = page
      .locator('header button')
      .filter({ hasText: GLOBAL_TEST_USER.username });
    await avatarButton.click();
    await page.getByRole('link', { name: 'messages' }).click();

    await expect(page).toHaveURL(routes.profile.messages);
  });

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

  test('Should not show Contact Seller on own product', async ({ page }) => {
    await page.goto(routes.products.detail(TEST_PRODUCTS.CANYON_AEROROAD.id));
    await expect(page.getByRole('button', { name: 'Contact Seller' })).not.toBeVisible();
  });

  test('Should start a conversation from product detail and render 1 conversation in profile/messages', async ({
    page,
  }) => {
    await page.goto(routes.products.detail(TEST_PRODUCTS.MMR_RAKISH.id));

    await page.getByRole('button', { name: 'Contact Seller' }).click();
    await page.waitForURL(/\/messages\//);

    conversationId = page.url().split('/messages/')[1]!;

    await page
      .getByPlaceholder('Write a message...')
      .fill('Hello, this is an E2E test message');
    await page.getByLabel('Send message').click();

    await page.getByRole('link', { name: 'Back to messages' }).click({ delay: 200 });
    await expect(page).toHaveURL(routes.profile.messages);
    await expect(page.getByText('1').first()).toBeVisible();
  });

  test('Should show conversation details in the messages list', async ({ page }) => {
    await page.goto(routes.profile.messages);

    await expect(page.getByText(TEST_PRODUCTS.MMR_RAKISH.title)).toBeVisible();

    await expect(
      page.getByRole('img', { name: TEST_PRODUCTS.MMR_RAKISH.title })
    ).toBeVisible();

    await expect(page.getByText('You: Hello, this is an E2E test message')).toBeVisible();
  });

  test('Should prevent sending an empty message', async ({ page }) => {
    await page.goto(routes.messages.chat(conversationId));

    await page.getByLabel('Send message').click();
    await page.getByRole('link', { name: 'Back to messages' }).click({ delay: 200 });

    await expect(page.getByText('1').first()).toBeVisible();
  });

  test('Should navigate to existing conversation via direct URL', async ({ page }) => {
    await page.goto(routes.messages.chat(conversationId));

    await expect(page.getByText(TEST_PRODUCTS.MMR_RAKISH.title)).toBeVisible();
    await expect(page.getByPlaceholder('Write a message...')).toBeVisible();
  });

  test('Should navigate to an existing conversation and send a new message', async ({
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

  test('Should cancel conversation deletion', async ({ page }) => {
    await page.goto(routes.profile.messages);

    await expect(page.getByText('1').first()).toBeVisible();

    await page.getByRole('button', { name: 'Delete conversation' }).click();
    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page.getByText('1').first()).toBeVisible();
  });

  test('Should remove an existing conversation', async ({ page }) => {
    await page.goto(routes.profile.messages);

    await expect(page.getByText('1').first()).toBeVisible();

    await page.getByRole('button', { name: 'Delete conversation' }).click();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();

    await expect(page.getByText('0').first()).toBeVisible();
  });
});
