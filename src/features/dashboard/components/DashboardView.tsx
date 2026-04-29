import { Plus } from 'lucide-react';
import Link from 'next/link';

import { routes } from '@/config/routes';
import type { ProductsWithFavoriteStatus } from '@/features/items/_shared/types';
import type { UserDTO } from '@/domain/user/types';

import { DashboardStats } from './DashboardStats';
import { DashboardProductPanel } from './DashboardProductPanel';

interface DashboardViewProps {
  user: UserDTO;
  products: ProductsWithFavoriteStatus[];
}

export const DashboardView = ({ user, products }: DashboardViewProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-muted">
            Welcome back, {user.username}! Manage your listings here.
          </p>
        </div>
        <Link href={routes.items.upload} className="btn btn-primary gap-2 px-6 py-3">
          <Plus className="h-5 w-5" />
          Upload Product
        </Link>
      </div>

      {/* Stats */}
      <DashboardStats products={products} />

      {/* Products List */}
      <DashboardProductPanel products={products} />
    </div>
  );
};
