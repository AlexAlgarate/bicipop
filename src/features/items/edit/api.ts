import prisma from '@/infrastructure/db/prisma/client';

import type { DataToUpdate } from './types';

export const updateProduct = async (data: DataToUpdate) => {
  const { productId, categoryId, ...rest } = data;
  return await prisma.product.update({
    where: { id: productId },
    data: {
      ...rest,
      category: { connect: { id: categoryId } },
    },
  });
};
