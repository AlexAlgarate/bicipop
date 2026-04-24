'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { getSession } from '@/lib/auth/session';
import { routes } from '@/utils/constants';
import { getFieldErrorsFromTree } from '@/lib/validations/validation-errors';
import { uploadImgInSupabaseBucket } from '@/lib/services/supabase/uploadImage';
import { isValidImage, type ProductFormState } from '@/features/items/shared/types';

import { createProductSchema } from './validation';
import { createProduct } from './api';

export const createProductAction = async (
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> => {
  const session = await getSession();

  if (!session?.userId) redirect(routes.auth.login);

  const rawValues = {
    title: String(formData.get('title')),
    description: String(formData.get('description')),
    location: String(formData.get('location')),
    price: Number(formData.get('price')),
    categoryId: String(formData.get('categoryId')),
  };
  const image = formData.get('imageUrl') as File;

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

  const parsed = createProductSchema.safeParse(rawValues);

  if (!parsed.success) {
    return errorState('There are errors in the form. Please correct them and try again', {
      errors: getFieldErrorsFromTree(parsed.error),
    });
  }

  if (!isValidImage(image)) return errorState('File must be an image');

  const imageUrl = await uploadImgInSupabaseBucket(image);
  try {
    await createProduct({ ...parsed.data, imageUrl, userId: session.userId });

    revalidatePath(`/`);
    redirect('/');
  } catch (error) {
    return errorState('Failed to upload the product. Please try again', {
      errors: error instanceof Error ? { general: [error.message] } : undefined,
    });
  }
};
