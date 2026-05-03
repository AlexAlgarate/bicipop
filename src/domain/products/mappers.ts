import type { Prisma } from '@/generated/client/client';

import type { ProductDTO, ProductWithUserContext } from './types';

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: { select: { name: true; slug: true } };
    user: { select: { username: true } };
  };
}>;

export const mapToProductDTO = (product: ProductWithRelations): ProductDTO => {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    imageUrl: product.imageUrl,
    userId: product.userId,
    categoryId: product.categoryId,
    location: product.location,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    username: product.user.username,
    status: product.status,
    categorySlug: product.category.slug,
    categoryName: product.category.name,
  };
};

export const mapToProductWithUserContext = (
  product: ProductWithRelations & { favorites: { userId: string }[] },
  currentUserId: string | null
): ProductWithUserContext => ({
  ...mapToProductDTO(product),
  isLiked: product.favorites?.length > 0,
  isOwner: product.userId === currentUserId,
});
