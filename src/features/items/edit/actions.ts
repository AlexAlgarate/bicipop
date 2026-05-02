'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { type ProductFormState } from '@/features/items/_shared/types';
import { getSession } from '@/infrastructure/auth/session';
import { routes } from '@/config/routes';
import type { ProductStatus } from '@/generated/client/enums';
import { getFieldErrorsFromTree } from '@/utils/validation-errors';
import { isNextControlFlowError } from '@/utils/error-handler';
import { getProductById } from '@/features/items/_shared/api';

import { updateProductSchema } from './validation';
import { updateProduct } from './api';

export const updateProductAction = async (
  _prevState: ProductFormState | null,
  formData: FormData
): Promise<ProductFormState | null> => {
  const session = await getSession();

  if (!session?.userId) redirect(routes.auth.login);

  const rawValues = {
    productId: String(formData.get('productId')),
    title: String(formData.get('title')),
    description: String(formData.get('description')),
    price: Number(formData.get('price')),
    imageUrl: String(formData.get('imageUrl') || ''),
    location: String(formData.get('location')),
    categoryId: String(formData.get('categoryId')),
    status: (formData.get('status') as ProductStatus) || 'ACTIVE',
  };

  const existingProduct = await getProductById(rawValues.productId, session.userId);

  if (!existingProduct || !existingProduct.isOwner) {
    return {
      success: false,
      message: 'You are not authorized to edit this product',
      requestId: Date.now(),
    };
  }

  const errorState = (
    message: string,
    extras?: Partial<ProductFormState>
  ): ProductFormState => ({
    success: false,
    message,
    requestId: Date.now(),
    values: {
      title: rawValues.title,
      description: rawValues.description,
      price: rawValues.price,
      location: rawValues.location,
      category: rawValues.categoryId,
    },
    ...extras,
  });

  const parsed = updateProductSchema.safeParse(rawValues);

  if (!parsed.success) {
    return errorState('There are errors in the form. Please correct them and try again', {
      errors: getFieldErrorsFromTree(parsed.error),
    });
  }

  try {
    await updateProduct({
      title: rawValues.title,
      description: rawValues.description,
      price: rawValues.price,
      location: rawValues.location,
      imageUrl: rawValues.imageUrl,
      categoryId: rawValues.categoryId,
      status: rawValues.status,
      productId: rawValues.productId,
    });
    revalidatePath(routes.home, 'layout');
    revalidatePath(routes.profile.dashboard, 'page');
    revalidatePath(routes.items.detail(rawValues.productId), 'page');
    redirect(routes.profile.dashboard);
  } catch (error) {
    if (isNextControlFlowError(error)) throw error;

    return errorState('Failed to update product. Please try again', {
      errors: error instanceof Error ? { general: [error.message] } : undefined,
    });
  }
};
