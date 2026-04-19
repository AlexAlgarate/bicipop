import { cache } from 'react';

import { mapToAdDTO } from '@/domain/products/mappers';
import { ProductDTO } from '@/domain/products/types';
import prisma from '@/lib/prisma';

export const getAdById = cache(async (id: string): Promise<ProductDTO | null> => {
  const ad = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      user: true,
    },
  });

  if (!ad) return null;

  return mapToAdDTO(ad);
});

export const getAdByOwner = async (
  adId: string,
  userId: string,
): Promise<{ id: string } | null> => {
  return prisma.product.findUnique({
    where: { id: adId, userId },
    select: { id: true },
  });
};

export const deleteAd = async (adId: string) => {
  return prisma.product.delete({ where: { id: adId } });
};

export const toggleFavorite = async (
  userId: string,
  productId: string,
): Promise<{ liked: boolean; likesCount: number }> => {
  const existingFavorite = await prisma.favorite.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existingFavorite) {
    await prisma.favorite.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  } else {
    await prisma.favorite.create({
      data: {
        userId,
        productId,
      },
    });
  }

  const likesCount = await prisma.favorite.count({
    where: { productId },
  });

  return { liked: !existingFavorite, likesCount };
};

export const getAdWithFavoriteStatus = cache(
  async (
    id: string,
    userId: string | null,
  ): Promise<(ProductDTO & { isLiked: boolean; isOwner: boolean }) | null> => {
    const ad = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        user: true,
      },
    });

    if (!ad) return null;

    const isLiked =
      userId !== null
        ? !!(await prisma.favorite.findUnique({
            where: {
              userId_productId: {
                userId,
                productId: id,
              },
            },
          }))
        : false;

    const likesCount = await prisma.favorite.count({
      where: { productId: id },
    });

    return {
      ...mapToAdDTO(ad),
      likes: likesCount,
      isLiked,
      isOwner: ad.userId === userId,
    };
  },
);
