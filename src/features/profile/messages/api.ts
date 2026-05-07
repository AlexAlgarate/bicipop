import { cache } from 'react';

import type { ConversationDTO, ConversationWithMessages } from '@/domain/message/types';
import prisma from '@/infrastructure/db/prisma/client';
import {
  mapToConversationDTO,
  mapToConversationWithMessages,
} from '@/domain/message/mapper';

const isUserParticipant = (
  conversation: { buyerId: string; sellerId: string },
  userId: string
): boolean => {
  return conversation.buyerId === userId || conversation.sellerId === userId;
};

export const getUserConversations = cache(
  async (userId: string): Promise<ConversationDTO[]> => {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
      include: {
        product: { select: { title: true, imageUrl: true, status: true } },
        buyer: { select: { username: true } },
        seller: { select: { username: true } },
        messages: {
          include: { sender: { select: { username: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
    return conversations.map(c => mapToConversationDTO(c, userId));
  }
);

export const getConversationWithMessages = cache(
  async (
    conversationId: string,
    userId: string
  ): Promise<ConversationWithMessages | null> => {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        product: { select: { title: true, imageUrl: true, status: true } },
        buyer: { select: { username: true } },
        seller: { select: { username: true } },
        messages: {
          include: { sender: { select: { username: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) return null;

    if (!isUserParticipant(conversation, userId)) return null;

    return mapToConversationWithMessages(conversation, userId);
  }
);

export const findOrCreateConversation = async (
  productId: string,
  buyerId: string
): Promise<string> => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { userId: true },
  });

  if (!product) throw new Error('Product not found');

  const sellerId = product.userId;
  if (sellerId === buyerId) throw new Error('You cannot contact yourself');

  const conversation = await prisma.conversation.upsert({
    where: { productId_buyerId: { productId, buyerId } },
    create: { productId, buyerId, sellerId },
    update: {},
    select: { id: true },
  });

  return conversation.id;
};

export const markMessagesAsRead = async (
  conversationId: string,
  userId: string
): Promise<void> => {
  await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: userId },
      readAt: null,
    },
    data: {
      readAt: new Date(),
    },
  });
};

export const getUnreadMessagesCount = cache(async (userId: string): Promise<number> => {
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ buyerId: userId }, { sellerId: userId }],
    },
    select: { id: true },
  });

  const conversationIds = conversations.map(c => c.id);

  return await prisma.message.count({
    where: {
      conversationId: { in: conversationIds },
      senderId: { not: userId },
      readAt: null,
    },
  });
});

export const findConversation = async (conversationId: string) => {
  return await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { buyerId: true, sellerId: true },
  });
};

export const createMessage = async (
  content: string,
  conversationId: string,
  userId: string
) => {
  await prisma.message.create({
    data: {
      content,
      conversationId,
      senderId: userId,
    },
  });
};

export const deleteConversation = async (
  conversationid: string,
  userId: string
): Promise<void> => {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationid },
    select: { buyerId: true, sellerId: true },
  });
  if (!conversation) throw new Error('Conversation not found');

  if (!isUserParticipant(conversation, userId)) {
    throw new Error('Not authorized to delete this conversation');
  }

  await prisma.conversation.delete({ where: { id: conversationid } });
};
