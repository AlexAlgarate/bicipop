export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { getSession } from '@/infrastructure/auth/session';
import { routes } from '@/config/routes';
import { getConversationWithMessages } from '@/features/profile/messages/api';
import { ChatView } from '@/features/profile/messages/components/chat/ChatView';

export const metadata: Metadata = {
  title: 'Chat — BiciPop',
  description: 'Chat with buyers and sellers on BiciPop',
};

interface ChatPageProps {
  params: Promise<{ conversationId: string }>;
}

const ChatPage = async ({ params }: ChatPageProps) => {
  const { conversationId } = await params;
  const session = await getSession();

  if (!session?.userId) {
    redirect(`${routes.auth.login}?callbackUrl=/messages/${conversationId}`);
  }

  const conversation = await getConversationWithMessages(conversationId, session.userId);
  if (!conversation) notFound();

  const isBuyer = conversation.buyerId === session.userId;
  const otherUsername = isBuyer
    ? conversation.sellerUsername
    : conversation.buyerUsername;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-stretch gap-4 border-b border-border bg-card px-4 py-3 shrink-0">
        <div>
          <Link
            href={routes.profile.messages}
            className="rounded-lg p-1.5 justify-center text-muted hover:bg-secondary hover:text-foreground transition-colors"
            aria-label="Back to messages"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={conversation.productImageUrl}
            alt={conversation.productTitle}
            fill
            className="object-cover"
            sizes="80px"
            unoptimized
          />
        </div>

        <div className="min-w-0 flex flex-col justify-between">
          <Link
            href={routes.products.detail(conversation.productId)}
            className="truncate font-medium text-sm sm:text-base hover:text-primary transition-colors block"
          >
            {conversation.productTitle}
          </Link>
          <p className="text-sm sm:text-base text-muted">
            {isBuyer ? 'Seller' : 'Buyer'}:{' '}
            <span className="font-medium">{otherUsername}</span>
          </p>
        </div>
      </div>

      <ChatView conversation={conversation} currentUserId={session.userId} />
    </div>
  );
};

export default ChatPage;
