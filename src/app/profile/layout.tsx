import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BottomSideBar, Sidebar } from '@/components/layout/Sidebar';
import { getCurrentUser } from '@/features/auth/api';
import { getUnreadMessagesCount } from '@/features/profile/messages/api';

const ProfileLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = await getCurrentUser();
  const unreadCount = user ? await getUnreadMessagesCount(user.id) : 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar unreadMessagesCount={unreadCount} />
      <div className="flex-1">
        <div className="container mx-auto flex gap-6 px-4 py-8 pb-24 sm:pb-8">
          <Sidebar user={user ?? undefined} unreadMessagesCount={unreadCount} />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
      <Footer className="hidden sm:block" />
      <BottomSideBar unreadMessagesCount={unreadCount} />
    </div>
  );
};

export default ProfileLayout;
