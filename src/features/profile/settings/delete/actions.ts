'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { SESSION_COOKIE_NAME } from '@/infrastructure/auth/constants';
import { routes } from '@/config/routes';
import { getFieldErrorsFromTree } from '@/utils/validation-errors';
import type { ProfileFormState } from '@/features/profile/settings/_shared/types';

import { deleteUserSchema } from './validation';
import { deleteUserAccount } from './api';

export const deleteUserAction = async (
  _prevState: ProfileFormState | null,
  formData: FormData
): Promise<ProfileFormState | null> => {
  const password = String(formData.get('password'));
  const parsed = deleteUserSchema.safeParse({ password });

  if (!parsed.success) {
    return {
      success: false,
      message: '',
      requestId: Date.now(),
      errors: getFieldErrorsFromTree(parsed.error),
    };
  }

  try {
    await deleteUserAccount(parsed.data.password);

    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete account',
      requestId: Date.now(),
      errors: error instanceof Error ? { general: [error.message] } : undefined,
    };
  }

  revalidatePath(routes.home);
  redirect(routes.home);
};
