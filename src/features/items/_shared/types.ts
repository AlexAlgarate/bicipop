import type { ProductDTO } from '@/domain/products/types';

export type ProductFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
  requestId: number;
  values?: Record<string, string | number>;
};

export interface Category {
  id: string;
  name: string;
  slug: string;
}
export type ProductsWithFavoriteStatus = ProductDTO & {
  isLiked: boolean;
  isOwner: boolean;
};
