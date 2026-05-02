import type { ProductsWithFavoriteStatus } from '@/features/items/_shared/types';

export interface FavoritesData {
  items: ProductsWithFavoriteStatus[];
  totalCount: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  query?: string;
}