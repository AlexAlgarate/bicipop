import type { ProductsWithFavoriteStatus } from '@/features/items/_shared/types';

export interface ProductsResultDto {
  items: ProductsWithFavoriteStatus[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}
