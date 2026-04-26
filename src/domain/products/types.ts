import type { ProductStatus } from '@/generated/client/enums';

export interface ProductDTO {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  userId: string;
  categoryId: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  userName: string;
  status: ProductStatus;
}

export type ProductWithRelations = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  userId: string;
  categoryId: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
  category: { name: string };
  user: { username: string };
  status: ProductStatus;
};
