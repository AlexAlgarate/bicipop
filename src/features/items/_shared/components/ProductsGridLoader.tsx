'use client';

import { Suspense } from 'react';

import type { ProductWithUserContext } from '@/domain/products/types';

import { ProductsGrid } from './ProductsGrid';
import { ProductsGridSkeleton } from './ProductsGridSkeleton';

interface ProductsGridLoaderProps {
  products: ProductWithUserContext[];
  currentPage: number;
  totalPages: number;
  emptyMessage?: {
    title: string;
    description: string;
    showLink?: boolean;
  };
}

export const ProductsGridLoader = (props: ProductsGridLoaderProps) => {
  return (
    <Suspense fallback={<ProductsGridSkeleton />}>
      <ProductsGrid {...props} />
    </Suspense>
  );
};
