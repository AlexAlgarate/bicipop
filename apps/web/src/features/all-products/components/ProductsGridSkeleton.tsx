import { PRODUCTS_PER_PAGE } from '@/utils/constants';
import { ProductCardSkeleton } from './ProductCardSkeleton';

export const ProductsGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);
