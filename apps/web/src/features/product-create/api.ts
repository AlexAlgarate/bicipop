import prisma from '@/lib/prisma';
import { CreateAdDTO } from './types';
import { ProductDTO } from '@/domain/products/types';
import { mapToAdDTO } from '@/domain/products/mappers';

export const createAd = async (data: CreateAdDTO): Promise<ProductDTO> => {
  const ad = await prisma.product.create({
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
  return mapToAdDTO(ad);
};
