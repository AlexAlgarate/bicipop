import { ProductDTO, ProductWithRelations } from './types';

export const mapToAdDTO = (ad: ProductWithRelations): ProductDTO => {
  return {
    id: ad.id,
    title: ad.title,
    description: ad.description,
    price: ad.price,
    imageUrl: ad.imageUrl,
    userId: ad.userId,
    categoryId: ad.categoryId,
    location: ad.location,
    likes: ad.likes,
    createdAt: ad.createdAt,
    updatedAt: ad.updatedAt,
    category: ad.category.name,
    userName: ad.user.username,
  };
};
