import { mapToProductDTO } from '@/domain/products/mappers';
import type { ProductStatus } from '@/generated/client/enums';
import prisma from '@/infrastructure/db/prisma/client';

export const getUserProducts = async (userId: string) => {
  const products = await prisma.product.findMany({
    where: { userId },
    include: { category: true, user: true },
    orderBy: { createdAt: 'desc' },
  });

  return products.map(mapToProductDTO);
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
