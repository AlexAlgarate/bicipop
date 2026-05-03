import type { Metadata } from 'next';

import { getSearchProducts } from '@/features/items/search/api';
import { ProductsGrid } from '@/features/items/_shared/components/ProductsGrid';
import { SearchFilters } from '@/features/items/search/components/SearchFilters';
import { getSession } from '@/infrastructure/auth/session';
import { getCategories } from '@/features/items/_shared/api';
import { BackToPageLink } from '@/components/ui/BackToPageLink';

export const metadata: Metadata = {
  title: 'Search - BiciPop',
  description: 'Search products in BiciPop',
};

interface SearchPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const params = await searchParams;
  const session = await getSession();

  const [categories, result] = await Promise.all([
    getCategories(),
    getSearchProducts(
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
    ),
  ]);

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
              {params.query ? `Results for "${params.query}"` : 'Search Results'}
            </h1>
            {result.totalCount > 0 && (
              <p className="text-sm text-muted mt-1">
                {result.totalCount} product{result.totalCount !== 1 ? 's' : ''} found
              </p>
            )}
          </div>

          <ProductsGrid
            products={result.items}
            currentPage={result.currentPage}
            totalPages={result.totalPages}
            emptyMessage={{
              title: 'No products found',
              description: 'Try adjusting your filters or search terms',
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
