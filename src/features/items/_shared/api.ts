import { cache } from 'react';

import prisma from '@/infrastructure/db/prisma/client';
import { mapToProductWithUserContext } from '@/domain/products/mappers';
import { mapToCategoryDTO } from '@/domain/category/mappers';
import type { ProductDTO, ProductWithUserContext } from '@/domain/products/types';
import type { CategoryDTO } from '@/domain/category/types';

export const getProductById = cache(
  async (
    id: string,
    userId: string | null = null
  ): Promise<(ProductDTO & { isOwner: boolean; isLiked: boolean }) | null> => {
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

    return mapToProductWithUserContext(product, userId) as ProductDTO & {
      isOwner: boolean;
      isLiked: boolean;
    };
  }
);

export const getCategories = async (): Promise<CategoryDTO[]> => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
  return categories.map(mapToCategoryDTO);
};

export const verifyProductOwnership = async (
  productId: string,
  userId: string
): Promise<boolean> => {
  const product = await prisma.product.findUnique({
    where: { id: productId, userId },
    select: { id: true },
  });

  return product !== null;
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

export const findProducts = async (
  page: number,
  pageSize: number,
  order: 'asc' | 'desc',
  userId: string | null,
  query?: string
): Promise<{ items: ProductWithUserContext[]; totalCount: number }> => {
  const where = query
    ? {
        OR: [
          { title: { contains: query, mode: 'insensitive' as const } },
          { description: { contains: query, mode: 'insensitive' as const } },
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

  const mappedItems = items.map(item => mapToProductWithUserContext(item, userId));

  return { items: mappedItems, totalCount };
};
