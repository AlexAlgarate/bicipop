import type { ConversationDTO } from '@/domain/message/types';
import { BackToPageLink } from '@/components/ui/BackToPageLink';

import { ConversationList } from './conversations/ConversationList';
import { ConversationStats } from './conversations/ConversationStats';

interface MessagesViewProps {
  conversations: ConversationDTO[];
  currentUserId: string;
}

export const MessagesView = ({ conversations, currentUserId }: MessagesViewProps) => {
  const unreadCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <BackToPageLink forceHome />

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="mt-1 text-muted text-sm">
            Your conversations with buyers and sellers
          </p>
        </div>
      </div>

      <ConversationStats
        total={conversations.length}
        unread={unreadCount}
        asBuyer={conversations.filter(c => c.buyerId === currentUserId).length}
        asSeller={conversations.filter(c => c.sellerId === currentUserId).length}
      />

      <div className="card">
        <div className="border-b border-border pb-4 mb-0">
          <h2 className="text-xl font-semibold">Your Conversations</h2>
          <p className="mt-1 text-sm text-muted">
            Click on a conversation to open the chat
          </p>
        </div>
        <ConversationList conversations={conversations} currentUserId={currentUserId} />
      </div>
    </div>
  );
};
