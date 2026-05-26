import { mapToProductWithUserContext } from '@/domain/products/mappers';
import { ProductStatus } from '@/generated/client/enums';
import prisma from '@/infrastructure/db/prisma/client';
import { validatePagination } from '@/features/products/_shared/utils/validate-pagination';
import type { PaginationParams } from '@/features/profile/_shared/types';

import type { DashboardData } from './types';

export const getUserDashboardProducts = async (
  userId: string,
  filters: PaginationParams
): Promise<DashboardData> => {
  const { page, pageSize } = validatePagination(filters.page, filters.pageSize);
  const where = {
    userId,
    ...(filters.query && {
      OR: [
        { title: { contains: filters.query, mode: 'insensitive' as const } },
        { description: { contains: filters.query, mode: 'insensitive' as const } },
      ],
    }),
  };

  const [totalCount, products, statusCounts] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where: where,
      include: {
        category: true,
        user: true,
        _count: { select: { favorites: true } },
        favorites: { where: { userId } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.groupBy({
      by: ['status'],
      where: { userId },
      _count: true,
    }),
  ]);

  const counts = { active: 0, reserved: 0, sold: 0 };
  for (const group of statusCounts) {
    if (group.status === ProductStatus.ACTIVE) counts.active = group._count;
    if (group.status === ProductStatus.RESERVED) counts.reserved = group._count;
    if (group.status === ProductStatus.SOLD) counts.sold = group._count;
  }

  return {
    products: products.map(product => mapToProductWithUserContext(product, userId)),
    totalCount,
    statusCounts: counts,
  };
};

export const deleteProduct = async (productId: string) => {
  return await prisma.product.delete({
    where: { id: productId },
  });
};

export const updateProductStatus = async (productId: string, status: ProductStatus) => {
  await prisma.product.update({
    where: { id: productId },
    data: { status },
  });
};
