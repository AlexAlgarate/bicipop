import { findProducts } from '@/features/items/shared/api';
import { getSession } from '@/infrastructure/auth/session';

import type { FilterProducts } from '../shared/types/filter.types';
import { getPagination } from '../shared/utils/get-pagination';
import { getWhereClause } from '../shared/utils/build-filters';

import type { ProductsResultDto } from './types';

export async function getProducts(filters: FilterProducts): Promise<ProductsResultDto> {
  const { page, pageSize } = getPagination(filters.page, filters.pageSize);

  const [session, whereClause] = await Promise.all([
    getSession(),
    Promise.resolve(getWhereClause(filters)),
  ]);

  const { items, totalCount } = await findProducts(
    whereClause,
    page,
    pageSize,
    filters.order,
    session?.userId ?? null
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return {
    items,
    totalCount,
    totalPages,
    currentPage: Math.min(page, totalPages),
  };
}
