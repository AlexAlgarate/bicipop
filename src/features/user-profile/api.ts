import { cache } from 'react';

import prisma from '@/infrastructure/db/prisma/client';
import type { ProductsWithFavoriteStatus } from '@/domain/products/types';
import { mapToProductWithFavoriteStatus } from '@/domain/products/mappers';
import { ProductStatus } from '@/generated/client/enums';

import type { UserProfile } from './types';

export const getUserProfileByUsername = cache(
  async (username: string): Promise<UserProfile | null> => {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        createdAt: true,
        _count: { select: { products: true } },
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      productsCount: user._count.products,
      createdAt: user.createdAt,
    };
  }
);

export const getUserProducts = cache(
  async (
    username: string,
    userId: string | null = null
  ): Promise<ProductsWithFavoriteStatus[]> => {
    const products = await prisma.product.findMany({
      where: {
        user: { username },
        status: ProductStatus.ACTIVE,
      },
      include: {
        category: true,
        user: true,
        _count: { select: { favorites: true } },
        favorites: userId ? { where: { userId } } : false,
      },
      orderBy: { createdAt: 'desc' },
    });

    return products.map(product => mapToProductWithFavoriteStatus(product, userId));
  }
);
