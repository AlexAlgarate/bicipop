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
  username: string;
  status: ProductStatus;
  categorySlug: string;
  categoryName: string;
}

export type ProductWithUserContext = ProductDTO & {
  isOwner: boolean;
  isLiked: boolean;
};
