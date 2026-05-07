import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getSession } from '@/infrastructure/auth/session';
import { routes } from '@/config/routes';
import { getUserConversations } from '@/features/profile/messages/api';
import { MessagesView } from '@/features/profile/messages/components/MessagesView';

export const metadata: Metadata = {
  title: 'Messages — BiciPop',
  description: 'Your conversations',
};

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  const session = await getSession();
  if (!session?.userId) redirect(routes.auth.login);

  const conversations = await getUserConversations(session.userId);

  return <MessagesView conversations={conversations} currentUserId={session.userId} />;
}
