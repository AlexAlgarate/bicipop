'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import type { ProductStatus } from '@/generated/client/enums';
import { getProductById } from '@/features/items/_shared/api';
import { routes } from '@/config/routes';
import { getSession } from '@/infrastructure/auth/session';

import { deleteProduct, updateProductStatus } from './api';
import type { ProductState } from './types';

export async function deleteProductAction(productId: string): Promise<void> {
  const session = await getSession();
  if (!session?.userId) redirect(routes.auth.login);

  const existingProduct = await getProductById(productId, session.userId);
  if (!existingProduct) redirect(routes.home);

  await deleteProduct(productId);

  revalidatePath(routes.home, 'layout');
  revalidatePath(routes.profile.dashboard, 'page');
}

export async function updateProductStatusAction(
  productId: string,
  status: ProductStatus
): Promise<ProductState> {
  const session = await getSession();
  if (!session?.userId) redirect(routes.auth.login);

  const existingProduct = await getProductById(productId);
  if (!existingProduct || existingProduct.userId !== session.userId) {
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
