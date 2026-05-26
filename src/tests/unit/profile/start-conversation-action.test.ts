import { describe, expect, test, vi } from 'vitest';
import { redirect } from 'next/navigation';

import { startConversationAction } from '@/features/profile/messages/actions';
import { getSession } from '@/infrastructure/auth/session';
import { findOrCreateConversation } from '@/features/profile/messages/api';
import { routes } from '@/config/routes';

import {
  VALID_USER_ID,
  VALID_PRODUCT_ID,
  VALID_CONVERSATION_ID,
  makeSession,
} from './__fixtures__/messages.fixtures';

vi.mock('@/infrastructure/db/prisma/client');
vi.mock('@/infrastructure/auth/session', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/features/profile/messages/api', () => ({
  findOrCreateConversation: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

describe('startConversationAction', () => {
  describe('Authentication', () => {
    test('Should redirect to login when there is no active session', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      await expect(startConversationAction(VALID_PRODUCT_ID)).rejects.toThrow(
        'NEXT_REDIRECT'
      );

      expect(redirect).toHaveBeenCalledWith(expect.stringContaining('login'));
    });

    test('Should include callbackUrl in redirect when session is missing', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      await expect(startConversationAction(VALID_PRODUCT_ID)).rejects.toThrow(
        'NEXT_REDIRECT'
      );

      expect(redirect).toHaveBeenCalledWith(
        expect.stringContaining(routes.products.detail(VALID_PRODUCT_ID))
      );
    });

    test('Should not call findOrCreateConversation when session is missing', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      await expect(startConversationAction(VALID_PRODUCT_ID)).rejects.toThrow(
        'NEXT_REDIRECT'
      );

      expect(findOrCreateConversation).not.toHaveBeenCalled();
    });
  });

  describe('Success', () => {
    test('Should create a conversation and redirect to chat', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());
      vi.mocked(findOrCreateConversation).mockResolvedValue(VALID_CONVERSATION_ID);

      await expect(startConversationAction(VALID_PRODUCT_ID)).rejects.toThrow(
        'NEXT_REDIRECT'
      );

      expect(findOrCreateConversation).toHaveBeenCalledWith(
        VALID_PRODUCT_ID,
        VALID_USER_ID
      );
      expect(redirect).toHaveBeenCalledWith(routes.messages.chat(VALID_CONVERSATION_ID));
    });
  });

  describe('Errors', () => {
    test('Should throw when findOrCreateConversation throws', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());
      vi.mocked(findOrCreateConversation).mockRejectedValue(
        new Error('Product not found')
      );

      await expect(startConversationAction(VALID_PRODUCT_ID)).rejects.toThrow(
        'Product not found'
      );
    });

    test('Should not redirect when findOrCreateConversation throws', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());
      vi.mocked(findOrCreateConversation).mockRejectedValue(
        new Error('You cannot contact yourself')
      );

      await expect(startConversationAction(VALID_PRODUCT_ID)).rejects.toThrow(
        'You cannot contact yourself'
      );

      expect(redirect).not.toHaveBeenCalled();
    });
  });
});
