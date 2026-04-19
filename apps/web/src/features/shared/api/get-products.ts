import prisma from '@/lib/prisma';
import { WhereClause } from '../utils/build-filters';
import { ProductDTO } from '@/domain/products/types';

export type AdWithFavoriteStatus = ProductDTO & {
  isLiked: boolean;
  isOwner: boolean;
};

export const findUsers = async (
  whereClause: WhereClause,
  page: number,
  pageSize: number,
  order: 'asc' | 'desc',
  userId: string | null,
): Promise<{ items: AdWithFavoriteStatus[]; totalProjects: number }> => {
  const totalProjects = await prisma.product.count({ where: whereClause });

  const items = await prisma.product.findMany({
    where: whereClause,
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: {
      createdAt: order,
    },
    include: {
      category: true,
      user: true,
    },
  });

  const itemsWithFavoriteStatus: AdWithFavoriteStatus[] = await Promise.all(
    items.map(async (item) => {
      const isLiked =
        userId !== null
          ? !!(await prisma.favorite.findUnique({
              where: {
                userId_productId: {
                  userId,
                  productId: item.id,
                },
              },
            }))
          : false;

      const likesCount = await prisma.favorite.count({
        where: { productId: item.id },
      });

      return {
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        userId: item.userId,
        categoryId: item.categoryId,
        location: item.location,
        likes: likesCount,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        category: item.category.name,
        userName: item.user.username,
        isLiked,
        isOwner: item.userId === userId,
      };
    }),
  );

  return { items: itemsWithFavoriteStatus, totalProjects };
};
