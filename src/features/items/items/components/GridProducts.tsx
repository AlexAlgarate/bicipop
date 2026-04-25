import { ProductCard } from '@/features/items/shared/components/ProductCard';
import { PRODUCTS_PER_PAGE } from '@/utils/constants';
import { Pagination } from '@/components/Pagination';
import type { ProductsSearchParams } from '@/features/items/shared/types/search-params.types';
import { getProducts } from '@/features/items/items/api';
import { EmptyState } from '@/features/items/items/components/EmptyState';

export const ProductsGrid = async (params: ProductsSearchParams) => {
  const {
    items: products,
    currentPage,
    totalPages,
  } = await getProducts({
    ...params,
    pageSize: PRODUCTS_PER_PAGE,
  });

  if (products.length === 0) return <EmptyState query={params.query} />;
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
