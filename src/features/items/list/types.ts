import type { ProductsWithFavoriteStatus } from '@/domain/products/types';

export interface ProductsResultDto {
  items: ProductsWithFavoriteStatus[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}
