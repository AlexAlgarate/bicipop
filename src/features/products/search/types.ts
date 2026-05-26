import type { ProductWithUserContext } from '@/domain/products/types';
import type { SearchFilters } from '@/features/products/_shared/types';

export interface SearchPageParams extends SearchFilters {
  order?: string;
  page?: string;
  pageSize?: string;
}

export interface SearchProductsResult {
  products: ProductWithUserContext[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}
