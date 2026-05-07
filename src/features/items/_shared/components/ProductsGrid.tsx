import { ProductCard } from '@/features/items/_shared/components/ProductCard';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/features/items/_shared/components/EmptyState';
import type { ProductWithUserContext } from '@/domain/products/types';

import { ProductsGridSkeleton } from './ProductsGridSkeleton';

interface ProductsGridProps {
  products: ProductWithUserContext[];
  currentPage: number;
  totalPages: number;
  emptyMessage?: {
    title: string;
    description: string;
    showLink?: boolean;
  };
  isLoading?: boolean;
}

export const ProductsGrid = ({
  products,
  currentPage,
  totalPages,
  emptyMessage,
  isLoading = false,
}: ProductsGridProps) => {
  if (isLoading) return <ProductsGridSkeleton />;

  if (products.length === 0) return <EmptyState {...emptyMessage} />;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-12">
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </>
  );
};
