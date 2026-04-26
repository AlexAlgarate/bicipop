import { cache } from 'react';

import prisma from '@/infrastructure/db/prisma/client';
import { mapToProductDTO } from '@/domain/products/mappers';
import type { ProductDTO } from '@/domain/products/types';
import type { WhereClause } from '@/features/items/shared/utils/build-filters';

export const getProductById = cache(async (id: string): Promise<ProductDTO | null> => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      user: true,
    },
  });

  if (!product) return null;

  return mapToProductDTO(product);
});

export const getCategories = async () => {
  return await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
};

export const getProductByOwner = async (
  adId: string,
  userId: string
): Promise<{ id: string } | null> => {
  return prisma.product.findUnique({
    where: { id: adId, userId },
    select: { id: true },
  });
};

export const toggleFavorite = async (
  userId: string,
  productId: string
): Promise<{ liked: boolean }> => {
  const favoriteKey = { userId_productId: { userId, productId } };

  return prisma.$transaction(async tx => {
    const existing = await tx.favorite.findUnique({ where: favoriteKey });

    if (existing) {
      await tx.favorite.delete({ where: favoriteKey });
    } else {
      await tx.favorite.create({ data: { userId, productId } });
    }

    return { liked: !existing };
  });
};

export const getProductWithFavoriteStatus = cache(
  async (
    id: string,
    userId: string | null
  ): Promise<(ProductDTO & { isLiked: boolean; isOwner: boolean }) | null> => {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        user: true,
        _count: { select: { favorites: true } },
        favorites: userId ? { where: { userId } } : false,
      },
    });

    if (!product) return null;

    const { _count, favorites, ...productData } = product;

    return {
      ...mapToProductDTO(productData),
      isLiked: (favorites?.length ?? 0) > 0,
      isOwner: product.userId === userId,
    };
  }
);

export type ProductsWithFavoriteStatus = ProductDTO & {
  isLiked: boolean;
  isOwner: boolean;
};

export const findProducts = async (
  whereClause: WhereClause,
  page: number,
  pageSize: number,
  order: 'asc' | 'desc',
  userId: string | null
): Promise<{ items: ProductsWithFavoriteStatus[]; totalCount: number }> => {
  const [totalCount, items] = await Promise.all([
    prisma.product.count({ where: whereClause }),
    prisma.product.findMany({
      where: whereClause,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: order },
      include: {
        category: true,
        user: true,
        _count: { select: { favorites: true } },
        favorites: userId ? { where: { userId } } : false,
      },
    }),
  ]);

  const mappedItems = items.map(({ _count, favorites, ...item }) => ({
    ...mapToProductDTO(item),
    isLiked: (favorites?.length ?? 0) > 0,
    isOwner: item.userId === userId,
  }));

  return { items: mappedItems, totalCount };
};
