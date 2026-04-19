import { ProductDTO } from '@/domain/products/types';

export interface ProductsResultDto {
  items: ProductDTO[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}
