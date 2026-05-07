import { Footer } from '@/components/layout/Footer';
import { BottomSideBar } from '@/components/layout/Sidebar';
import { getCurrentUser } from '@/features/auth/api';
import { getUnreadMessagesCount } from '@/features/profile/messages/api';

const ProfileLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();

  const unreadCount = user ? await getUnreadMessagesCount(user.id) : 0;

  return (
    <div className="flex flex-col min-h-screen">
      {children}

      <Footer className="hidden sm:block" />

      <BottomSideBar unreadMessagesCount={unreadCount} />
    </div>
  );
};

export default ProfileLayout;
