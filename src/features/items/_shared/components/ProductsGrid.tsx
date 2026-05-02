import { ProductCard } from '@/features/items/_shared/components/ProductCard';
import { Pagination } from '@/components/Pagination';
import { EmptyState } from '@/features/items/_shared/components/EmptyState';
import type { ProductsWithFavoriteStatus } from '@/features/items/_shared/types';

interface ProductsGridProps {
  products: ProductsWithFavoriteStatus[];
  currentPage: number;
  totalPages: number;
  emptyMessage?: {
    title: string;
    description: string;
    showLink?: boolean;
  };
}

export const ProductsGrid = ({
  products,
  currentPage,
  totalPages,
  emptyMessage,
}: ProductsGridProps) => {
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
