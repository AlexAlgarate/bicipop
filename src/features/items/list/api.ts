import { findProducts } from '@/features/items/shared/api';
import { getSession } from '@/infrastructure/auth/session';

import { getPagination } from './utils/get-pagination';
import type { FilterProducts, ProductsResultDto } from './types';

export async function getProducts(filters: FilterProducts): Promise<ProductsResultDto> {
  const { page, pageSize } = getPagination(filters.page, filters.pageSize);

  const session = await getSession();

  const { items, totalCount } = await findProducts(
    page,
    pageSize,
    filters.order,
    session?.userId ?? null,
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
