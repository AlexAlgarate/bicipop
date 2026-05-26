import type { Metadata } from 'next';
import { Suspense } from 'react';

import { getSearchProducts } from '@/features/products/search/api';
import { ProductsGrid } from '@/features/products/_shared/components/ProductsGrid';
import { ProductsGridSkeleton } from '@/features/products/_shared/components/ProductsGridSkeleton';
import { SearchFilters } from '@/features/products/search/components/SearchFilters';
import { getSession } from '@/infrastructure/auth/session';
import { getCategories } from '@/features/products/_shared/api';
import { BackToPageLink } from '@/components/ui/BackToPageLink';

export const metadata: Metadata = {
  title: 'Search - BiciPop',
  description: 'Search products in BiciPop',
};

interface SearchPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

const ProductsGridWrapper = async ({ searchParams }: SearchPageProps) => {
  const params = await searchParams;
  const session = await getSession();

  const result = await getSearchProducts(
    {
      query: params.query,
      category: params.category,
      location: params.location,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      page: params.page,
      order: params.order,
    },
    session?.userId ?? null
  );

  return (
    <ProductsGrid
      products={result.products}
      currentPage={result.currentPage}
      totalPages={result.totalPages}
      emptyMessage={{
        title: 'No products found',
        description: 'Try adjusting your filters or search terms',
      }}
    />
  );
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const params = await searchParams;
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 shrink-0">
          <SearchFilters categories={categories} />
        </aside>

        <main className="flex-1">
          <BackToPageLink forceHome />
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              {params.query || params.category
                ? `Results for "${params.query || params.category}"`
                : 'Search Results'}
            </h1>
          </div>

          <Suspense fallback={<ProductsGridSkeleton />}>
            <ProductsGridWrapper searchParams={searchParams} />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
