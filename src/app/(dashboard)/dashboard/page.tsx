import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { routes } from '@/config/routes';
import { getUserProducts } from '@/features/dashboard/api';
import { DashboardView } from '@/features/dashboard/components/DashboardView';
import { getCurrentUser } from '@/features/auth/api';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your products on Bicipop',
};

export const dynamic = 'force-dynamic';

const DashboardPage = async () => {
  const user = await getCurrentUser();

  if (!user) redirect(routes.auth.login);

  const userId = user.id as string;
  const products = await getUserProducts(userId);

  return <DashboardView user={user} products={products} />;
};

export default DashboardPage;
