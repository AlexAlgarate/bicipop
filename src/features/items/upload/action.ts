'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { getSession } from '@/infrastructure/auth/session';
import { routes } from '@/utils/constants';
import { getFieldErrorsFromTree } from '@/infrastructure/validations/validation-errors';
import {
  logAndSerializeError,
  toErrorArray,
  isNextControlFlowError,
} from '@/infrastructure/validations/error-handler';
import { uploadImgInSupabaseBucket } from '@/infrastructure/db/supabase/uploadImage';
import { isValidImage, type ProductFormState } from '@/features/items/shared/types';

import { createProduct } from './api';
import { createProductSchema } from './validation';

const errorState = (
  message: string,
  extras?: Partial<ProductFormState>
): ProductFormState => ({
  success: false,
  message,
  requestId: Date.now(),
  ...extras,
});

const resolveImageUrl = async (
  formData: FormData
): Promise<string | ProductFormState> => {
  const imageMode = formData.get('imageMode');

  if (imageMode === 'url') {
    const imageUrl = String(formData.get('imageUrl'));
    return imageUrl || errorState('Image URL is required');
  }

  if (imageMode === 'file') {
    const file = formData.get('imageFile') as File;

    if (!file || file.size === 0) return errorState('Image file is required');
    if (!isValidImage(file)) return errorState('File must be an image');

    return await uploadImgInSupabaseBucket(file);
  }

  return errorState('Inavlid image mode');
};

export const uploadProductAction = async (
  _prevState: ProductFormState | null,
  formData: FormData
): Promise<ProductFormState | null> => {
  const session = await getSession();
  if (!session?.userId) redirect(routes.auth.login);

  const rawValues = {
    title: String(formData.get('title')),
    description: String(formData.get('description')),
    location: String(formData.get('location')),
    price: Number(formData.get('price')),
    categoryId: String(formData.get('categoryId')),
  };

  const parsed = createProductSchema.safeParse(rawValues);

  if (!parsed.success) {
    return errorState('There are errors in the form. Please correct them and try again', {
      errors: getFieldErrorsFromTree(parsed.error),
    });
  }

  const imageResult = await resolveImageUrl(formData);
  if (typeof imageResult !== 'string') return imageResult;

  try {
    await createProduct({
      ...parsed.data,
      imageUrl: imageResult,
      userId: session.userId,
    });

    revalidatePath(`/`);
    redirect('/');
  } catch (error) {
    if (isNextControlFlowError(error)) {
      throw error;
    }

    const { userMessage, details } = logAndSerializeError(error, 'createProductAction');

    return errorState(
      'Failed to upload the product. Please try again',

      {
        errors: {
          general: toErrorArray(userMessage),
          _debug:
            process.env.NODE_ENV === 'development' ? toErrorArray(details) : undefined,
        },
      }
    );
  }
};
