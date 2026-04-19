import { ProductsResultDto } from './types';
import { getPagination, getWhereClause } from '../shared/utils/build-filters';
import { FilterProducts } from '../shared/types/filter.types';
import { findUsers } from '../shared/api/get-products';
import { getSession } from '@/lib/auth';

export async function getProducts(filters: FilterProducts): Promise<ProductsResultDto> {
  const { safePage, safePageSize } = getPagination(filters.page, filters.pageSize);

  const whereClause = getWhereClause(
    filters.query,
    filters.category,
    filters.minPrice,
    filters.maxPrice,
  );

  const session = await getSession();
  const userId = session?.userId ?? null;

  const { items, totalProjects } = await findUsers(
    whereClause,
    safePage,
    safePageSize,
    filters.order,
    userId,
  );

  const totalPages = Math.max(1, Math.ceil(totalProjects / safePageSize));
  const currentPage = Math.min(safePage, totalPages);

  return {
    items: items as unknown as ProductsResultDto['items'],
    totalCount: totalProjects,
    totalPages,
    currentPage,
  };
}
