import type { ProductWithUserContext } from '@/domain/products/types';

export interface ProductsResultDto {
  items: ProductWithUserContext[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}
