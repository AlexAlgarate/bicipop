import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { getCurrentUser } from '@/features/auth/api';
import { getUnreadMessagesCount } from '@/features/profile/messages/api';

const LayoutWithSearchbar = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();

  const unreadCount = user ? await getUnreadMessagesCount(user.id) : 0;

  return (
    <>
      <Navbar unreadMessagesCount={unreadCount} showSearchBar />

      <div className="flex-1">
        <div className="container mx-auto flex gap-6 px-4 py-8 pb-24 sm:pb-8">
          <Sidebar user={user ?? undefined} unreadMessagesCount={unreadCount} />

          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </>
  );
};

export default LayoutWithSearchbar;
