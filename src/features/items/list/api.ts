import type { FilterProducts } from '@/features/items/_shared/types';
import { findProducts } from '@/features/items/_shared/api';
import { validatePagination } from '@/features/items/_shared/utils/validate-pagination';

import type { ProductsResultDto } from './types';

export async function getProducts(
  filters: FilterProducts,
  userId: string | null = null
): Promise<ProductsResultDto> {
  const {
    page: requestedPage,
    pageSize: requestedPageSize,
    order,
    ...searchFilters
  } = filters;
  const { page, pageSize } = validatePagination(requestedPage, requestedPageSize);

  const { items, totalCount } = await findProducts(
    page,
    pageSize,
    order,
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
