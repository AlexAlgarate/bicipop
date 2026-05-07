import { Navbar } from '@/components/layout/Navbar/Navbar';
import { getCurrentUser } from '@/features/auth/api';
import { getUnreadMessagesCount } from '@/features/profile/messages/api';

const ChatLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();
  const unreadCount = user ? await getUnreadMessagesCount(user.id) : 0;

  return (
    <div className="flex flex-col h-screen">
      <Navbar unreadMessagesCount={unreadCount} />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
};

export default ChatLayout;
