import { cache } from 'react';

import prisma from '@/infrastructure/db/prisma/client';
import { getSession } from '@/infrastructure/auth/session';
import { mapToProductDTO } from '@/domain/products/mappers';
import type { ProductDTO } from '@/domain/products/types';

export const getProductById = cache(
  async (id: string): Promise<(ProductDTO & { isOwner: boolean; isLiked: boolean }) | null> => {
    const session = await getSession();
    const userId = session?.userId ?? null;

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

export type ProductsWithFavoriteStatus = ProductDTO & {
  isLiked: boolean;
  isOwner: boolean;
};

export const findProducts = async (
  page: number,
  pageSize: number,
  order: 'asc' | 'desc',
  userId: string | null,
  query?: string
): Promise<{ items: ProductsWithFavoriteStatus[]; totalCount: number }> => {
  const where = query
    ? {
        OR: [
          { title: { contains: query, mode: 'insensitive' as const } },
          { description: { contains: query } },
        ],
      }
    : {};

  const [totalCount, items] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
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
