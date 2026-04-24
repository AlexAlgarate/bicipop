import prisma from '@/infrastructure/db/prisma/client';

import type { dataToUpdate } from './types';

export const updateProduct = async (data: dataToUpdate) => {
  return await prisma.product.update({
    where: { id: data.productId },
    data: { ...data },
  });
};
