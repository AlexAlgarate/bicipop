import type { FilterProducts, SearchFilters } from '@/features/items/_shared/types';

import { validatePagination } from '../_shared/utils/validate-pagination';
import { findProducts } from '../_shared/api';

import type { ProductsResultDto } from './types';

export async function getProducts(
  filters: FilterProducts,
  userId: string | null = null
): Promise<ProductsResultDto> {
  const { page, pageSize } = validatePagination(filters.page, filters.pageSize);

  const searchFilters: SearchFilters = {
    query: filters.query,
  };

  const { items, totalCount } = await findProducts(
    page,
    pageSize,
    filters.order,
    userId ?? null,
    searchFilters
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return {
    items,
    totalCount,
    totalPages,
    currentPage: Math.min(page, totalPages),
  };
}
