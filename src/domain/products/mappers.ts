import type { ProductDTO, ProductWithRelations } from './types';

export const mapToProductDTO = (product: ProductWithRelations): ProductDTO => {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    imageUrl: product.imageUrl,
    userId: product.userId,
    categoryId: product.categoryId,
    location: product.location,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    category: product.category.name,
    userName: product.user.username,
    status: product.status,
  };
};
