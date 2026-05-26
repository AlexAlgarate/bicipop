import { beforeEach, describe, expect, test, vi } from 'vitest';
import { revalidatePath } from 'next/cache';

import { markAsReadAction } from '@/features/profile/messages/actions';
import { getSession } from '@/infrastructure/auth/session';
import { markMessagesAsRead } from '@/features/profile/messages/api';

import {
  VALID_USER_ID,
  VALID_CONVERSATION_ID,
  makeSession,
} from './__fixtures__/messages.fixtures';

vi.mock('@/infrastructure/auth/session', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/features/profile/messages/api', () => ({
  markMessagesAsRead: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('markAsReadAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication', () => {
    test('Should silently return when there is no active session', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      await markAsReadAction(VALID_CONVERSATION_ID);

      expect(markMessagesAsRead).not.toHaveBeenCalled();
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    test('Should silently return when session has no userId', async () => {
      vi.mocked(getSession).mockResolvedValue({} as { userId: string });

      await markAsReadAction(VALID_CONVERSATION_ID);

      expect(markMessagesAsRead).not.toHaveBeenCalled();
    });
  });

  describe('Success', () => {
    test('Should call markMessagesAsRead with conversationId and userId', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());

      await markAsReadAction(VALID_CONVERSATION_ID);

      expect(markMessagesAsRead).toHaveBeenCalledWith(
        VALID_CONVERSATION_ID,
        VALID_USER_ID
      );
    });

    test('Should revalidate the messages list path', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());

      await markAsReadAction(VALID_CONVERSATION_ID);

      expect(revalidatePath).toHaveBeenCalledWith(expect.stringContaining('messages'));
    });
  });
});
