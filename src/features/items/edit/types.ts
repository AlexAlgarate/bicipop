import type { ProductStatus } from '@/generated/client/client';

export interface DataToUpdate {
  title: string;
  description: string;
  price: number;
  location: string;
  imageUrl: string;
  status: ProductStatus;
  categoryId: string;
  productId: string;
}
