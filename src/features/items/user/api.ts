import { cache } from 'react';

import prisma from '@/infrastructure/db/prisma/client';
import { mapToProductWithUserContext } from '@/domain/products/mappers';
import { ProductStatus } from '@/generated/client/enums';
import { getPagination } from '@/features/items/_shared/utils/get-pagination';
import type { ProductWithUserContext } from '@/domain/products/types';

import type { UserProfile } from './types';

interface PaginationParams {
  page: number;
  pageSize: number;
  query?: string;
}

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
    userId: string | null = null,
    filters: PaginationParams
  ): Promise<{ items: ProductWithUserContext[]; totalCount: number }> => {
    const { page, pageSize } = getPagination(filters.page, filters.pageSize);

    const where = filters.query
      ? {
          user: { username },
          status: ProductStatus.ACTIVE,
          OR: [
            { title: { contains: filters.query, mode: 'insensitive' as const } },
            { description: { contains: filters.query, mode: 'insensitive' as const } },
          ],
        }
      : {
          user: { username },
          status: ProductStatus.ACTIVE,
        };

    const [totalCount, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          user: true,
          _count: { select: { favorites: true } },
          favorites: userId ? { where: { userId } } : false,
        },
      }),
    ]);

    const items = products.map(product => mapToProductWithUserContext(product, userId));

    return { items, totalCount };
  }
);
