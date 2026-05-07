import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import type { ConversationDTO } from '@/domain/message/types';
import { routes } from '@/config/routes';
import { formatDate } from '@/utils/format';

interface ConversationListProps {
  conversations: ConversationDTO[];
  currentUserId: string;
}

export const ConversationList = ({
  conversations,
  currentUserId,
}: ConversationListProps) => {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <MessageCircle className="h-12 w-12 text-muted mb-4" />
        <h3 className="font-semibold text-lg mb-1">No messages yet</h3>
        <p className="text-sm text-muted">
          When you contact a seller or receive a message, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {conversations.map(conversation => (
        <ConversationRow
          key={conversation.id}
          conversation={conversation}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};

interface ConversationRowProps {
  conversation: ConversationDTO;
  currentUserId: string;
}
const ConversationRow = ({ conversation, currentUserId }: ConversationRowProps) => {
  const isBuyer = conversation.buyerId === currentUserId;
  const otherUsername = isBuyer
    ? conversation.sellerUsername
    : conversation.buyerUsername;

  const hasUnread = conversation.unreadCount > 0;

  return (
    <Link
      href={routes.messages.chat(conversation.id)}
      className="flex items-stretch gap-3 px-2 py-3 rounded-lg hover:bg-background/20 transition-colors group"
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={conversation.productImageUrl}
          alt={conversation.productTitle}
          fill
          className="object-cover"
          sizes="56px"
        />
      </div>

      <div className="flex flex-1 min-w-0 justify-between gap-2">
        <div className="flex flex-col justify-between min-w-0">
          <p className="truncate font-medium text-sm sm:text-base leading-snug group-hover:text-primary transition-colors">
            {conversation.productTitle}
          </p>

          <p className="text-sm text-muted">
            {isBuyer ? 'Seller' : 'Buyer'}:{' '}
            <span className="font-medium text-foreground">{otherUsername}</span>
          </p>

          {conversation.lastMessage && (
            <p
              className={`truncate text-sm ${
                hasUnread ? 'font-semibold text-foreground' : 'text-muted'
              }`}
            >
              {conversation.lastMessage.senderId === currentUserId ? 'You: ' : ''}
              {conversation.lastMessage.content}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end justify-between shrink-0">
          {conversation.lastMessage && (
            <span className="text-xs text-muted">
              {formatDate(conversation.lastMessage.createdAt)}
            </span>
          )}

          {hasUnread ? (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
            </div>
          ) : (
            <div className="h-5 w-5" /> // placeholder para mantener el layout
          )}
        </div>
      </div>
    </Link>
  );
};
