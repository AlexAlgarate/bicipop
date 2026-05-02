import prisma from '@/infrastructure/db/prisma/client';
import { mapToProductWithFavoriteStatus } from '@/domain/products/mappers';
import { getPagination } from '@/features/items/_shared/utils/get-pagination';
import type { PaginationParams } from '@/features/profile/_shared/types';

interface FavoritesData {
  items: Awaited<ReturnType<typeof mapToProductWithFavoriteStatus>>[];
  totalCount: number;
}

export const getUserFavorites = async (
  userId: string,
  filters: PaginationParams
): Promise<FavoritesData> => {
  const { page, pageSize } = getPagination(filters.page, filters.pageSize);

  const [totalCount, products] = await Promise.all([
    prisma.favorite.count({
      where: { userId },
    }),
    prisma.favorite.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
            user: true,
            _count: { select: { favorites: true } },
            favorites: { where: { userId } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const items = products
    .filter(fav => fav.product.userId !== userId)
    .map(fav => mapToProductWithFavoriteStatus(fav.product, userId));

  return { items, totalCount };
};
