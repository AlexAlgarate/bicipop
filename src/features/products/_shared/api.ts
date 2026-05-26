import { cache } from 'react';

import prisma from '@/infrastructure/db/prisma/client';
import { mapToProductWithUserContext } from '@/domain/products/mappers';
import { mapToCategoryDTO } from '@/domain/category/mappers';
import type { ProductWithUserContext } from '@/domain/products/types';
import type { CategoryDTO } from '@/domain/category/types';
import type { Prisma } from '@/generated/client/client';

import type { SearchFilters } from './types';

export const getProductById = cache(
  async (
    id: string,
    userId: string | null = null
  ): Promise<ProductWithUserContext | null> => {
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

    return mapToProductWithUserContext(product, userId);
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

const buildWhereClause = (filters?: SearchFilters): Prisma.ProductWhereInput => ({
  ...(filters?.query && {
    OR: [
      { title: { contains: filters.query, mode: 'insensitive' } },
      { description: { contains: filters.query, mode: 'insensitive' } },
    ],
  }),
  ...(filters?.category && {
    category: { slug: filters.category },
  }),
  ...(filters?.location && {
    location: { contains: filters.location, mode: 'insensitive' },
  }),
  ...((filters?.minPrice !== undefined || filters?.maxPrice !== undefined) && {
    price: {
      ...(filters.minPrice !== undefined && { gte: filters.minPrice }),
      ...(filters.maxPrice !== undefined && { lte: filters.maxPrice }),
    },
  }),
});

export const findProducts = async (
  page: number,
  pageSize: number,
  order: 'asc' | 'desc',
  userId: string | null,
  filters?: SearchFilters
): Promise<{ products: ProductWithUserContext[]; totalCount: number }> => {
  const where = buildWhereClause(filters);

  const [totalCount, products] = await Promise.all([
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

  const mappedProducts = products.map(product =>
    mapToProductWithUserContext(product, userId)
  );

  return { products: mappedProducts, totalCount };
};
