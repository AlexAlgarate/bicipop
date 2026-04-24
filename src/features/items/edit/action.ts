import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { type ProductFormState } from '@/features/items/shared/types';
import { getSession } from '@/lib/auth/session';
import { routes } from '@/utils/constants';
import type { ProductStatus } from '@/generated/client/enums';
import prisma from '@/lib/client';
import { getFieldErrorsFromTree } from '@/lib/validations/validation-errors';

import { updateProductSchema } from './validation';

export const updateProductAction = async (
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> => {
  const session = await getSession();

  if (!session?.userId) redirect(routes.auth.login);

  const rawValues = {
    productId: String(formData.get('productId')),
    title: String(formData.get('title')),
    description: String(formData.get('description')),
    price: Number(formData.get('price')),
    imageUrl: String(formData.get('imageUrl')),
    location: String(formData.get('location')),
    categoryId: String(formData.get('categoryId')),
    status: formData.get('status') as ProductStatus,
    image: String(formData.get('imageUrl')),
  };

  const existingProduct = await prisma.product.findUnique({
    where: { id: rawValues.productId },
  });

  if (!existingProduct || existingProduct.userId !== session.userId) {
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
    const data = {
      title: rawValues.title,
      description: rawValues.description,
      price: rawValues.price,
      location: rawValues.location,
      imageUrl: rawValues.image,
      categoryId: rawValues.categoryId,
      status: rawValues.status,
    };

    await prisma.product.update({
      where: { id: rawValues.productId },
      data: { ...data },
    });

    revalidatePath('/', 'layout');
    revalidatePath('/dashboard', 'page');
    revalidatePath(`/product/${rawValues.productId}`, 'page');
    redirect(`/product/${rawValues.productId}`);
  } catch (error) {
    return errorState('Failed to update product. Please try again', {
      errors: error instanceof Error ? { general: [error.message] } : undefined,
    });
  }
};
