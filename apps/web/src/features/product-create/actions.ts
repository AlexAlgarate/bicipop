'use server';

import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { saveImageInPublic } from '@/lib/uploads';
import { createProductSchema } from '@/features/product-create/validation';
import { getFieldErrorsFromTree } from '@/lib/validations/validation-errors';
import { createAd } from '@/features/product-create/api';
import { ProductFormState } from './types';

export const createAdAction = async (
  _previousState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> => {
  const session = await getSession();
  if (!session?.userId) {
    redirect('/login');
  }

  const titleInput = String(formData.get('title'));
  const descriptionInput = String(formData.get('description'));
  const locationInput = String(formData.get('location'));
  const priceInput = Number(formData.get('price'));
  const categoryIdInput = String(formData.get('categoryId'));
  const image = formData.get('imageUrl') as File;

  const parsed = createProductSchema.safeParse({
    title: titleInput,
    description: descriptionInput,
    location: locationInput,
    price: priceInput,
    categoryId: categoryIdInput,
  });

  if (!parsed.success) {
    return {
      success: false,
      message:
        'Hay errores en el formulario. Por favor, corrígelos e inténtelo de nuevo.',
      errors: getFieldErrorsFromTree(parsed.error),
      requestId: Date.now(),
      values: {
        title: titleInput,
        description: descriptionInput,
        price: priceInput,
        location: locationInput,
        category: categoryIdInput,
      },
    };
  }

  const validImage = isValidImage(image);
  if (!validImage) {
    return {
      success: false,
      message: 'El archivo debe ser una imagen',
      requestId: Date.now(),
      values: {
        title: titleInput,
        description: descriptionInput,
        price: priceInput,
        location: locationInput,
        category: categoryIdInput,
      },
    };
  }
  const imageUrl = await saveImageInPublic(image);

  await createAd({
    ...parsed.data,
    imageUrl,
    userId: session.userId,
  });
  revalidatePath(`/`);
  redirect('/');
};

const VALID_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/jpg']);

const isValidImage = (image: File | null): image is File =>
  !!image && VALID_IMAGE_TYPES.has(image.type);
