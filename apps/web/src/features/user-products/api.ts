import { getSession } from '@/lib/auth';
import { getPagination, getWhereClause } from '../shared/utils/build-filters';
import { FilterProducts } from '../shared/types/filter.types';
import { findUsers } from '../shared/api/get-products';

export const getUserProducts = async (filters: FilterProducts) => {
  const session = await getSession();
  if (!session?.userId) {
    return {
      items: [],
      totalCount: 0,
      totalPages: 1,
      currentPage: 1,
    };
  }

  const { safePage, safePageSize } = getPagination(filters.page, filters.pageSize);

  const whereClause = {
    ...getWhereClause(
      filters.query,
      filters.category,
      filters.minPrice,
      filters.maxPrice,
    ),
    userId: session.userId,
  };

  const { items, totalProjects } = await findUsers(
    whereClause,
    safePage,
    safePageSize,
    filters.order,
    session.userId,
  );

  const totalPages = Math.max(1, Math.ceil(totalProjects / safePageSize));
  const currentPage = Math.min(safePage, totalPages);

  return {
    items,
    totalCount: totalProjects,
    totalPages,
    currentPage,
  };
};
