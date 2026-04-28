import type {
  ProductDTO,
  ProductWithRelations,
  ProductsWithFavoriteStatus,
} from './types';

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
    userName: product.user.username,
    status: product.status,
    categorySlug: product.category.slug,
    categoryName: product.category.name,
  };
};

export const mapToProductWithFavoriteStatus = (
  product: ProductWithRelations & { favorites: { userId: string }[] },
  currentUserId: string | null
): ProductsWithFavoriteStatus => ({
  ...mapToProductDTO(product),
  isLiked: product.favorites.length > 0,
  isOwner: product.userId === currentUserId,
});
