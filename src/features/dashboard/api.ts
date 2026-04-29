import { mapToProductWithFavoriteStatus } from '@/domain/products/mappers';
import type { ProductStatus } from '@/generated/client/enums';
import prisma from '@/infrastructure/db/prisma/client';
import type { ProductsWithFavoriteStatus } from '@/domain/products/types';

export const getUserProducts = async (
  userId: string
): Promise<ProductsWithFavoriteStatus[]> => {
  const products = await prisma.product.findMany({
    where: { userId },
    include: {
      category: true,
      user: true,
      _count: { select: { favorites: true } },
      favorites: { where: { userId } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return products.map(product => mapToProductWithFavoriteStatus(product, userId));
};

export const deleteProduct = async (productId: string) => {
  await prisma.product.delete({
    where: { id: productId },
  });
};

export const updateProductStatus = async (productId: string, status: ProductStatus) => {
  await prisma.product.update({
    where: { id: productId },
    data: { status },
  });
};
