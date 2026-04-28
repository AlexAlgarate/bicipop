'use server'

import { revalidatePath } from 'next/cache';

import type { ProductStatus } from '@/generated/client/enums';
import { getCurrentUser } from '@/infrastructure/auth/session';
import { getProductById } from '@/features/items/shared/api';

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

  const existingProduct = await getProductById(productId);

  if (!existingProduct || existingProduct.userId !== currentUser.id) {
    return {
      success: false,
      message: 'You are not authorized to delete this product',
    };
  }

  try {
    await deleteProduct(productId);

    revalidatePath('/', 'layout');
    revalidatePath('/dashboard', 'page');

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

  if (!existingProduct || existingProduct.userId !== currentUser.id) {
    return {
      success: false,
      message: 'You are not authorized to update this product',
    };
  }

  try {
    await updateProductStatus(productId, status);

    revalidatePath('/', 'layout');
    revalidatePath('/dashboard', 'page');

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