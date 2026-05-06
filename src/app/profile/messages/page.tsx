import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

import { getSession } from '@/infrastructure/auth/session';
import { routes } from '@/config/routes';
import { getUserConversations } from '@/features/messages/api';
import { ConversationList } from '@/features/messages/components/ConversationList';
import { BackToPageLink } from '@/components/ui/BackToPageLink';

export const metadata: Metadata = {
  title: 'Messages — BiciPop',
  description: 'Your conversations',
};

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  const session = await getSession();
  if (!session?.userId) redirect(routes.auth.login);

  const conversations = await getUserConversations(session.userId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <BackToPageLink forceHome />

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Messages</h1>
            <p className="text-base text-muted mt-2">
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <ConversationList
            conversations={conversations}
            currentUserId={session.userId}
          />
        </div>
      </div>
    </div>
  );
}
