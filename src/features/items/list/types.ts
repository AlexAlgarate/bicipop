import type { ProductsWithFavoriteStatus } from '@/domain/products/types';

export interface ProductsResultDto {
  items: ProductsWithFavoriteStatus[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface FilterProducts {
  query: string;
  order: 'asc' | 'desc';
  page: number;
  pageSize: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}
