import type { ProductDTO } from '@/domain/products/types';

export type ProductFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
  requestId: number;
  values?: Record<string, string | number>;
};

export interface FilterProducts {
  query: string;
  order: 'asc' | 'desc';
  page: number;
  pageSize: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}
export type ProductsWithFavoriteStatus = ProductDTO & {
  isLiked: boolean;
  isOwner: boolean;
};
