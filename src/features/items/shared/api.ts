import { cache } from 'react';

import prisma from '@/infrastructure/db/prisma/client';
import { mapToProductDTO } from '@/domain/products/mappers';
import type { ProductDTO } from '@/domain/products/types';

export const getProductById = cache(async (id: string): Promise<ProductDTO | null> => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      user: true,
    },
  });

  if (!product) return null;

  return mapToProductDTO(product);
});

export const getCategories = async () => {
  return await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
};
