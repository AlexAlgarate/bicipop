'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { getSession } from '@/infrastructure/auth/session';
import { routes } from '@/config/routes';
import { getFieldErrorsFromTree } from '@/utils/validation-errors';
import {
  logAndSerializeError,
  toErrorArray,
  isNextControlFlowError,
} from '@/utils/error-handler';
import { uploadImgInSupabaseBucket } from '@/infrastructure/db/supabase/upload-image';
import { type ProductFormState } from '@/features/products/_shared/types';

import { createProduct } from './api';
import { createProductSchema, isValidImage } from './validation';

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
  formData: FormData,
  extras?: Partial<ProductFormState>
): Promise<string | ProductFormState> => {
  const file = formData.get('imageFile');

  if (!(file instanceof File) || file.size === 0) {
    return errorState('Image file is required', {
      ...extras,
      errors: { ...extras?.errors, imageFile: ['Image file is required'] },
    });
  }

  if (!isValidImage(file)) {
    return errorState('File must be an image', {
      ...extras,
      errors: { ...extras?.errors, imageFile: ['File must be an image'] },
    });
  }

  return await uploadImgInSupabaseBucket(file);
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
      values: {
        title: rawValues.title,
        description: rawValues.description,
        price: rawValues.price,
        location: rawValues.location,
        categoryId: rawValues.categoryId,
      },
    });
  }

  try {
    const imageResult = await resolveImageUrl(formData, {
      values: {
        title: rawValues.title,
        description: rawValues.description,
        price: rawValues.price,
        location: rawValues.location,
        categoryId: rawValues.categoryId,
      },
    });
    if (typeof imageResult !== 'string') return imageResult;

    await createProduct({
      ...parsed.data,
      imageUrl: imageResult,
      userId: session.userId,
    });

    revalidatePath(routes.home);
    redirect(routes.home);
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
