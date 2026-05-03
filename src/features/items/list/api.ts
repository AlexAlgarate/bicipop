import { findProducts } from '@/features/items/_shared/api';
import { validatePagination } from '@/features/items/_shared/utils/validate-pagination';
import type { FilterProducts } from '@/features/items/_shared/types';

import type { ProductsResultDto } from './types';

export async function getProducts(
  filters: FilterProducts,
  userId: string | null = null
): Promise<ProductsResultDto> {
  const { page, pageSize } = validatePagination(filters.page, filters.pageSize);

  const { items, totalCount } = await findProducts(
    page,
    pageSize,
    filters.order,
    userId ?? null,
    filters.query
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return {
    items,
    totalCount,
    totalPages,
    currentPage: Math.min(page, totalPages),
  };
}
