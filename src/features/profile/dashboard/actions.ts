'use server';

import { revalidatePath } from 'next/cache';

import type { ProductStatus } from '@/generated/client/enums';
import { getProductById } from '@/features/items/_shared/api';
import { getCurrentUser } from '@/features/auth/api';
import { routes } from '@/config/routes';

import { deleteProduct, updateProductStatus } from './api';
import type { ProductState } from './types';

export async function deleteProductAction(productId: string): Promise<ProductState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      success: false,
      message: 'You must be logged in to delete a product',
    };
  }

  const existingProduct = await getProductById(productId, currentUser.id);

  if (!existingProduct || !existingProduct.isOwner) {
    return {
      success: false,
      message: 'You are not authorized to delete this product',
    };
  }

  try {
    await deleteProduct(productId);

    revalidatePath(routes.home, 'layout');
    revalidatePath(routes.profile.dashboard, 'page');

    return {
      success: true,
      message: 'Product deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting product:', error);
    return {
      success: false,
      message: 'Failed to delete product. Please try again.',
    };
  }
}

export async function updateProductStatusAction(
  productId: string,
  status: ProductStatus
): Promise<ProductState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      success: false,
      message: 'You must be logged in to update product status',
    };
  }

  const existingProduct = await getProductById(productId);

  if (!existingProduct || !existingProduct.isOwner) {
    return {
      success: false,
      message: 'You are not authorized to update this product',
    };
  }

  try {
    await updateProductStatus(productId, status);

    revalidatePath(routes.home, 'layout');
    revalidatePath(routes.profile.dashboard, 'page');

    return {
      success: true,
      message: 'Product status updated successfully',
    };
  } catch (error) {
    console.error('Error updating product status:', error);
    return {
      success: false,
      message: 'Failed to update product status. Please try again.',
    };
  }
}
