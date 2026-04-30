import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { routes } from '@/config/routes';
import { getUserDashboardProducts } from '@/features/profile/dashboard/api';
import { DashboardView } from '@/features/profile/dashboard/components/DashboardView';
import { getCurrentUser } from '@/features/auth/api';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your products on Bicipop',
};

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 10;

interface DashboardPageProps {
  page?: string;
  query?: string;
}

const DashboardPage = async ({
  searchParams,
}: {
  searchParams: Promise<DashboardPageProps>;
}) => {
  const user = await getCurrentUser();
  if (!user) redirect(routes.auth.login);
  const userId = user.id as string;

  const { page, query } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;

  const data = await getUserDashboardProducts(userId, {
    page: currentPage,
    pageSize: PAGE_SIZE,
    query,
  });

  return (
    <DashboardView
      user={user}
      data={data}
      currentPage={currentPage}
      pageSize={PAGE_SIZE}
    />
  );
};

export default DashboardPage;
