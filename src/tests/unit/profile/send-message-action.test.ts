import { describe, expect, test, vi } from 'vitest';
import { revalidatePath } from 'next/cache';

import { sendMessageAction } from '@/features/profile/messages/actions';
import { getSession } from '@/infrastructure/auth/session';
import { findConversation, createMessage } from '@/features/profile/messages/api';
import prisma from '@/infrastructure/db/prisma/client';

import {
  VALID_USER_ID,
  VALID_CONVERSATION_ID,
  makeSession,
  makeConversation,
  buildMessageFormData,
} from './__fixtures__/messages.fixtures';

vi.mock('@/infrastructure/auth/session', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/features/profile/messages/api', () => ({
  findConversation: vi.fn(),
  createMessage: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/infrastructure/db/prisma/client', () => ({
  default: {
    conversation: {
      update: vi.fn(),
    },
  },
}));

const setupAuthenticatedAsBuyer = () => {
  vi.mocked(getSession).mockResolvedValue(makeSession());
  vi.mocked(findConversation).mockResolvedValue(makeConversation());
};

describe('sendMessageAction', () => {
  describe('Authentication', () => {
    test('Should return error when there is no active session', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const result = await sendMessageAction(
        VALID_CONVERSATION_ID,
        buildMessageFormData()
      );

      expect(result).toEqual({ success: false, error: 'Not authenticated' });
    });

    test('Should not call createMessage when session is missing', async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      await sendMessageAction(VALID_CONVERSATION_ID, buildMessageFormData());

      expect(createMessage).not.toHaveBeenCalled();
    });
  });

  describe('Validation', () => {
    test('Should return error when content is empty', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());

      const result = await sendMessageAction(
        VALID_CONVERSATION_ID,
        buildMessageFormData('')
      );

      expect(result).toEqual({ success: false, error: 'Message cannot be empty' });
    });

    test('Should return error when content is only whitespace', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());

      const result = await sendMessageAction(
        VALID_CONVERSATION_ID,
        buildMessageFormData('   ')
      );

      expect(result).toEqual({ success: false, error: 'Message cannot be empty' });
    });

    test('Should return error when content exceeds 2000 characters', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());

      const result = await sendMessageAction(
        VALID_CONVERSATION_ID,
        buildMessageFormData('a'.repeat(2001))
      );

      expect(result).toEqual({ success: false, error: 'Message too long' });
    });

    test('Should not call createMessage when validation fails', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());

      await sendMessageAction(VALID_CONVERSATION_ID, buildMessageFormData(''));

      expect(createMessage).not.toHaveBeenCalled();
    });
  });

  describe('Conversation checks', () => {
    test('Should return error when conversation does not exist', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());
      vi.mocked(findConversation).mockResolvedValue(null);

      const result = await sendMessageAction(
        VALID_CONVERSATION_ID,
        buildMessageFormData()
      );

      expect(result).toEqual({ success: false, error: 'Conversation not found' });
    });

    test('Should return error when user is not a participant', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());
      vi.mocked(findConversation).mockResolvedValue({
        buyerId: 'some-other-user',
        sellerId: 'yet-another-user',
      });

      const result = await sendMessageAction(
        VALID_CONVERSATION_ID,
        buildMessageFormData()
      );

      expect(result).toEqual({ success: false, error: 'Not a participant' });
    });

    test('Should not call createMessage when conversation is not found', async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession());
      vi.mocked(findConversation).mockResolvedValue(null);

      await sendMessageAction(VALID_CONVERSATION_ID, buildMessageFormData());

      expect(createMessage).not.toHaveBeenCalled();
    });
  });

  describe('Success', () => {
    test('Should call createMessage with content, conversationId and userId', async () => {
      setupAuthenticatedAsBuyer();

      const result = await sendMessageAction(
        VALID_CONVERSATION_ID,
        buildMessageFormData()
      );

      expect(result).toEqual({ success: true });
      expect(createMessage).toHaveBeenCalledWith(
        'Hello, is this still available?',
        VALID_CONVERSATION_ID,
        VALID_USER_ID
      );
    });

    test('Should update conversation updatedAt', async () => {
      setupAuthenticatedAsBuyer();

      await sendMessageAction(VALID_CONVERSATION_ID, buildMessageFormData());

      expect(prisma.conversation.update).toHaveBeenCalledWith({
        where: { id: VALID_CONVERSATION_ID },
        data: { updatedAt: expect.any(Date) },
      });
    });

    test('Should revalidate the chat and list paths after sending', async () => {
      setupAuthenticatedAsBuyer();

      await sendMessageAction(VALID_CONVERSATION_ID, buildMessageFormData());

      expect(revalidatePath).toHaveBeenCalledWith(
        expect.stringContaining(VALID_CONVERSATION_ID)
      );
      expect(revalidatePath).toHaveBeenCalledWith(expect.stringContaining('messages'));
    });
  });
});
