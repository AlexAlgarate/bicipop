import { mapToProductDTO } from '@/domain/products/mappers';
import { ProductStatus } from '@/generated/client/enums';
import prisma from '@/infrastructure/db/prisma/client';
import type { ProductWithUserContext } from '@/domain/products/types';
import { getProductById } from '@/features/items/_shared/api';

interface GetRelatedProductsOptions {
  categoryId: string;
  excludeId: string;
  excludeUserId: string;
  limit?: number;
  currentUserId?: string | null;
}

export const getRelatedProducts = async ({
  categoryId,
  excludeId,
  excludeUserId,
  limit = 4,
  currentUserId = null,
}: GetRelatedProductsOptions): Promise<ProductWithUserContext[]> => {
  const items = await prisma.product.findMany({
    where: {
      categoryId,
      status: ProductStatus.ACTIVE,
      id: { not: excludeId },
      userId: { not: excludeUserId },
    },
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      user: true,
      _count: { select: { favorites: true } },
      favorites: currentUserId ? { where: { userId: currentUserId } } : false,
    },
  });

  return items.map(({ _count, favorites, ...item }) => ({
    ...mapToProductDTO(item),
    likes: _count.favorites,
    isLiked: (favorites?.length ?? 0) > 0,
    isOwner: item.userId === currentUserId,
  }));
};

export const getProductDetailData = async (id: string, userId: string | null) => {
  const product = await getProductById(id, userId);
  if (!product) return null;

  const relatedProducts = await getRelatedProducts({
    categoryId: product.categoryId,
    excludeId: product.id,
    excludeUserId: product.userId,
    limit: 4,
    currentUserId: userId,
  });

  return { product, relatedProducts };
};
