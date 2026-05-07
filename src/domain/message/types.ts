export interface MessageDTO {
  id: string;
  content: string;
  senderId: string;
  senderUsername: string;
  conversationId: string;
  readAt: Date | null;
  createdAt: Date;
}

export interface ConversationDTO {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  productId: string;
  productTitle: string;
  productImageUrl: string;
  productStatus: string;
  buyerId: string;
  buyerUsername: string;
  sellerId: string;
  sellerUsername: string;
  lastMessage: MessageDTO | null;
  unreadCount: number;
}

export interface ConversationWithMessages extends ConversationDTO {
  messages: MessageDTO[];
}
