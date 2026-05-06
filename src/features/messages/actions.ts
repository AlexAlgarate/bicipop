'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { routes } from '@/config/routes';
import { getSession } from '@/infrastructure/auth/session';
import { isNextControlFlowError } from '@/utils/error-handler';
import prisma from '@/infrastructure/db/prisma/client';

import {
  createMessage,
  findConversation,
  findOrCreateConversation,
  markMessagesAsRead,
} from './api';

export const startConversationAction = async (productId: string): Promise<void> => {
  const session = await getSession();
  if (!session?.userId)
    redirect(`${routes.auth.login}?callbackUrl=${routes.items.detail(productId)}`);

  try {
    const conversationId = await findOrCreateConversation(productId, session.userId);
    redirect(routes.messages.chat(conversationId));
  } catch (error) {
    if (isNextControlFlowError(error)) throw error;
    throw error;
  }
};

interface SendMessageI {
  success: boolean;
  error?: string | undefined;
}

export const sendMessageAction = async (
  conversationId: string,
  formData: FormData
): Promise<SendMessageI> => {
  const session = await getSession();
  if (!session?.userId) return { success: false, error: 'Not authenticated' };

  const content = String(formData.get('content')).trim();

  if (!content) return { success: false, error: 'Message cannot be empty' };
  if (content.length > 2000) return { success: false, error: 'Message too long' };

  const conversation = await findConversation(conversationId);
  if (!conversation) return { success: false, error: 'Conversation not found' };

  const isParticipant =
    conversation.buyerId === session.userId || conversation.sellerId === session.userId;
  if (!isParticipant) return { success: false, error: 'Not a participant' };

  await createMessage(content, conversationId, session.userId);

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  revalidatePath(routes.messages.chat(conversationId));
  revalidatePath(routes.messages.list);

  return { success: true };
};

export const markAsReadAction = async (conversationId: string): Promise<void> => {
  const session = await getSession();
  if (!session?.userId) return;

  await markMessagesAsRead(conversationId, session.userId);
  revalidatePath(routes.messages.list);
};
