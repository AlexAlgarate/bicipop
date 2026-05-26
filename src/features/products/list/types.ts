import type { ProductWithUserContext } from '@/domain/products/types';

export interface ProductsResultDto {
  products: ProductWithUserContext[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}
