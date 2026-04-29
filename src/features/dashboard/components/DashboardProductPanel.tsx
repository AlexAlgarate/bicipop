import { Plus, Package } from 'lucide-react';
import Link from 'next/link';

import { routes } from '@/config/routes';
import type { ProductsWithFavoriteStatus } from '@/features/items/_shared/types';

import { DashboardProductList } from './DashboardProductList';

export const DashboardProductPanel = ({
  products,
}: {
  products: ProductsWithFavoriteStatus[];
}) => {
  return (
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
  );
};
