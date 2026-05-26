import { describe, expect, test, vi } from 'vitest';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { deleteConversationAction } from '@/features/profile/messages/actions';
import { getSession } from '@/infrastructure/auth/session';
import { deleteConversation } from '@/features/profile/messages/api';

import {
  VALID_USER_ID,
  VALID_CONVERSATION_ID,
  makeSession,
} from './__fixtures__/messages.fixtures';

vi.mock('@/infrastructure/db/prisma/client');

vi.mock('@/infrastructure/auth/session', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/features/profile/messages/api', () => ({
  deleteConversation: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('deleteConversationAction', () => {
  describe('Authentication', () => {
    test('Should redirect to login when there is no active session', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      await expect(deleteConversationAction(VALID_CONVERSATION_ID)).rejects.toThrow(
        'NEXT_REDIRECT'
      );

      expect(redirect).toHaveBeenCalledWith(expect.stringContaining('login'));
    });

    test('Should not call deleteConversation when session is missing', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      await expect(deleteConversationAction(VALID_CONVERSATION_ID)).rejects.toThrow(
        'NEXT_REDIRECT'
      );

      expect(deleteConversation).not.toHaveBeenCalled();
    });
  });

  describe('Success', () => {
    test('Should call deleteConversation with conversationId and userId', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());

      await deleteConversationAction(VALID_CONVERSATION_ID);

      expect(deleteConversation).toHaveBeenCalledWith(
        VALID_CONVERSATION_ID,
        VALID_USER_ID
      );
    });

    test('Should revalidate the messages list path after deletion', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());

      await deleteConversationAction(VALID_CONVERSATION_ID);

      expect(revalidatePath).toHaveBeenCalledWith(expect.stringContaining('messages'));
    });
  });
});
