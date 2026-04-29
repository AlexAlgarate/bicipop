import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Plus, Package, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';

import { routes } from '@/config/routes';
import { getUserProducts } from '@/features/dashboard/api';
import DashboardProductList from '@/features/dashboard/components/DashboardProductList';
import { ProductStatus } from '@/generated/client/enums';
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

  const activeProducts = products.filter(p => p.status === ProductStatus.ACTIVE).length;
  const reservedProducts = products.filter(
    p => p.status === ProductStatus.RESERVED
  ).length;
  const soldProducts = products.filter(p => p.status === ProductStatus.SOLD).length;
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
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card flex items-center gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{products.length}</p>
            <p className="text-sm text-muted">Total Products</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="rounded-full bg-green-500/10 p-3">
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{activeProducts}</p>
            <p className="text-sm text-muted">Active</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="rounded-full bg-yellow-500/10 p-3">
            <Clock className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{reservedProducts}</p>
            <p className="text-sm text-muted">Reserved</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="rounded-full bg-red-500/10 p-3">
            <Package className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{soldProducts}</p>
            <p className="text-sm text-muted">Sold</p>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="card">
        <div className="border-b border-border pb-4">
          <h2 className="text-xl font-semibold">Your Products</h2>
          <p className="mt-1 text-sm text-muted">
            Manage your listings, update status, or remove products
          </p>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-(--card-hover) p-6">
              <Package className="h-12 w-12 text-muted" />
            </div>
            <h3 className="text-xl font-semibold">No products yet</h3>
            <p className="mt-2 max-w-sm text-muted">
              Start selling by uploading your first product
            </p>
            <Link
              href={routes.items.upload}
              className="btn btn-primary mt-6 gap-2 px-6 py-3"
            >
              <Plus className="h-5 w-5" />
              Upload Product
            </Link>
          </div>
        ) : (
          <DashboardProductList products={products} />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
