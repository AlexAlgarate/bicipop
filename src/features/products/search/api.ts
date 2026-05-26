import { findProducts } from '@/features/products/_shared/api';
import { validatePagination } from '@/features/products/_shared/utils/validate-pagination';
import { PRODUCTS_PER_PAGE } from '@/utils/constants';
import { type SearchFilters } from '@/features/products/_shared/types';

import type { SearchPageParams, SearchProductsResult } from './types';

export const getSearchProducts = async (
  params: SearchPageParams,
  userId: string | null = null
): Promise<SearchProductsResult> => {
  const { page, pageSize } = validatePagination(
    parseInt(params.page ?? '1', 10),
    parseInt(params.pageSize ?? String(PRODUCTS_PER_PAGE), 10)
  );

  const order: 'asc' | 'desc' = params.order === 'asc' ? 'asc' : 'desc';

  const filters: SearchFilters = {
    query: params.query,
    category: params.category,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    location: params.location,
  };

  const { products, totalCount } = await findProducts(
    page,
    pageSize,
    order,
    userId,
    filters
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return {
    products,
    totalCount,
    totalPages,
    currentPage: Math.min(page, totalPages),
  };
};
