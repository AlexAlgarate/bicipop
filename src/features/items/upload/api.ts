import prisma from '@/infrastructure/db/prisma/client';
import { mapToProductDTO } from '@/domain/products/mappers';

import type { CreateProductDto } from './types';

export const createProduct = async (data: CreateProductDto) => {
  const product = await prisma.product.create({
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl,
      location: data.location,
      userId: data.userId,
      categoryId: data.categoryId,
    },
    include: {
      category: true,
      user: true,
    },
  });

  return mapToProductDTO(product);
};
