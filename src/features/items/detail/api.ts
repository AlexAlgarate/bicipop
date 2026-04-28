import { mapToProductDTO } from '@/domain/products/mappers';
import { ProductStatus } from '@/generated/client/enums';
import prisma from '@/infrastructure/db/prisma/client';

import type { ProductsWithFavoriteStatus } from '../_shared/types';

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
}: GetRelatedProductsOptions): Promise<ProductsWithFavoriteStatus[]> => {
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
