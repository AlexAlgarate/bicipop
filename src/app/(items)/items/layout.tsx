import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getCurrentUser } from '@/features/auth/api';
import { getUnreadMessagesCount } from '@/features/profile/messages/api';

const ItemsLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = await getCurrentUser();
  const unreadCount = user ? await getUnreadMessagesCount(user.id) : 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar unreadMessagesCount={unreadCount} />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
};

export default ItemsLayout;
