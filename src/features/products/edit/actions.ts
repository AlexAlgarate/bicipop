'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { type ProductFormState } from '@/features/products/_shared/types';
import { getSession } from '@/infrastructure/auth/session';
import { routes } from '@/config/routes';
import { ProductStatus } from '@/generated/client/enums';
import { getFieldErrorsFromTree } from '@/utils/validation-errors';
import { isNextControlFlowError } from '@/utils/error-handler';
import { getProductById } from '@/features/products/_shared/api';

import { updateProductSchema } from './validation';
import { updateProduct } from './api';

const errorState = (
  message: string,
  extras?: Partial<ProductFormState>
): ProductFormState => ({
  success: false,
  message,
  requestId: Date.now(),
  ...extras,
});

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
    status: (formData.get('status') as ProductStatus) || ProductStatus.ACTIVE,
  };

  const existingProduct = await getProductById(rawValues.productId, session?.userId);

  if (!existingProduct || !existingProduct.isOwner) {
    return errorState('You are not authorized to edit this product');
  }

  const parsed = updateProductSchema.safeParse(rawValues);

  if (!parsed.success) {
    return errorState('There are errors in the form. Please correct them and try again', {
      errors: getFieldErrorsFromTree(parsed.error),
    });
  }

  try {
    await updateProduct({
      title: parsed.data.title,
      description: parsed.data.description,
      price: parsed.data.price,
      location: parsed.data.location,
      imageUrl: parsed.data.imageUrl ?? '',
      categoryId: parsed.data.categoryId,
      status: parsed.data.status,
      productId: parsed.data.productId,
    });
    revalidatePath(routes.home, 'layout');
    revalidatePath(routes.profile.dashboard, 'page');
    revalidatePath(routes.products.detail(rawValues.productId), 'page');
    redirect(routes.profile.dashboard);
  } catch (error) {
    if (isNextControlFlowError(error)) throw error;

    return errorState('Failed to update product. Please try again', {
      errors: error instanceof Error ? { general: [error.message] } : undefined,
    });
  }
};
