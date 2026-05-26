import type { FilterProducts } from '@/features/products/_shared/types';
import { findProducts } from '@/features/products/_shared/api';
import { validatePagination } from '@/features/products/_shared/utils/validate-pagination';

import type { ProductsResultDto } from './types';

export const getProducts = async (
  filters: FilterProducts,
  userId: string | null = null
): Promise<ProductsResultDto> => {
  const {
    page: requestedPage,
    pageSize: requestedPageSize,
    order,
    ...searchFilters
  } = filters;
  const { page, pageSize } = validatePagination(requestedPage, requestedPageSize);

  const { products, totalCount } = await findProducts(
    page,
    pageSize,
    order,
    userId ?? null,
    searchFilters
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return {
    products,
    totalCount,
    totalPages,
    currentPage: Math.min(page, totalPages),
  };
};
