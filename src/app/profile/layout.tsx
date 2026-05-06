import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BottomSideBar, Sidebar } from '@/components/layout/Sidebar';
import { getCurrentUser } from '@/features/auth/api';

const ProfileLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <div className="container mx-auto flex gap-6 px-4 py-8 pb-24 sm:pb-8">
          <Sidebar user={user ?? undefined} />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
      <Footer className="hidden sm:block" />
      <BottomSideBar />
    </div>
  );
};

export default ProfileLayout;
