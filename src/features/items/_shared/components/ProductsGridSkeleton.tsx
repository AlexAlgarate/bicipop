'use client';

import { ProductCardSkeleton } from './ProductCardSkeleton';

interface ProductsGridSkeletonProps {
  count?: number;
}

export const ProductsGridSkeleton = ({ count = 8 }: ProductsGridSkeletonProps) => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>

      <div className="mt-12 flex justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 w-10 bg-muted rounded-lg" />
        ))}
      </div>
    </div>
  );
};
