import type { ProductsWithFavoriteStatus } from '@/features/items/shared/api';

export interface ProductsResultDto {
  items: ProductsWithFavoriteStatus[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}
