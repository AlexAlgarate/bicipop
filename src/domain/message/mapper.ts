import type { Prisma } from '@/generated/client/client';

import type { ConversationDTO, ConversationWithMessages, MessageDTO } from './types';

type MessageRaw = Prisma.MessageGetPayload<{
  include: { sender: { select: { username: true } } };
}>;

type ConversationBase = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  productId: string;
  buyerId: string;
  sellerId: string;
  product: { title: string; imageUrl: string; status: string };
  buyer: { username: string };
  seller: { username: string };
};

const mapToMessageDTO = (message: MessageRaw): MessageDTO => ({
  id: message.id,
  content: message.content,
  senderId: message.senderId,
  senderUsername: message.sender.username,
  conversationId: message.conversationId,
  readAt: message.readAt,
  createdAt: message.createdAt,
});

export const mapToConversationDTO = (
  conversation: ConversationBase & { messages: MessageRaw[] },
  currentUserId: string
): ConversationDTO => {
  const unreadCount = conversation.messages.filter(
    msg => msg.readAt === null && msg.senderId !== currentUserId
  ).length;

  return {
    id: conversation.id,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    productId: conversation.productId,
    productTitle: conversation.product.title,
    productImageUrl: conversation.product.imageUrl,
    productStatus: conversation.product.status,
    buyerId: conversation.buyerId,
    buyerUsername: conversation.buyer.username,
    sellerId: conversation.sellerId,
    sellerUsername: conversation.seller.username,
    lastMessage: conversation.messages[0]
      ? mapToMessageDTO(conversation.messages[0])
      : null,
    unreadCount,
  };
};

export const mapToConversationWithMessages = (
  conversation: ConversationBase & { messages: MessageRaw[] },
  currentUserId: string
): ConversationWithMessages => ({
  ...mapToConversationDTO(conversation, currentUserId),
  messages: conversation.messages.map(mapToMessageDTO),
});
