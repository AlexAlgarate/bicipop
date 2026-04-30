import type { DashboardProductProps } from '../types';

import { DashboardProductList } from './DashboardProductList';
import { NotUserProductsAvailable } from './DashboardNotProductsAvailable';

export const DashboardProductPanel = ({ products }: DashboardProductProps) => {
  return (
    <div className="card">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-semibold">Your Products</h2>
        <p className="mt-1 text-sm text-muted">
          Manage your listings, update status, or remove products
        </p>
      </div>

      {products.length === 0 ? (
        <NotUserProductsAvailable />
      ) : (
        <DashboardProductList products={products} />
      )}
    </div>
  );
};
