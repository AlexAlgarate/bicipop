import type { Prisma } from '@/generated/client/client';
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
  userName: string;
  status: ProductStatus;
  categorySlug: string;
  categoryName: string;
}

export type ProductWithUserContext = ProductDTO & {
  isOwner: boolean;
  isLiked: boolean;
};

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: { select: { name: true; slug: true } };
    user: { select: { username: true } };
  };
}>;
