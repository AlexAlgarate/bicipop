import prisma from '@/infrastructure/db/prisma/client';
import { mapToProductDTO } from '@/domain/products/mappers';

import type { DataToUpdate } from './types';

export const updateProduct = async (data: DataToUpdate) => {
  const { productId, categoryId, ...rest } = data;
  const product = await prisma.product.update({
    where: { id: productId },
    data: { ...rest, category: { connect: { id: categoryId } } },
    include: { category: true, user: true },
  });

  return mapToProductDTO(product);
};
