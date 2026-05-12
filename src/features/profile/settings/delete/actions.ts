'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { routes } from '@/config/routes';
import { getFieldErrorsFromTree } from '@/utils/validation-errors';
import type { ProfileFormState } from '@/features/profile/settings/_shared/types';
import { deleteSession, getSession } from '@/infrastructure/auth/session';

import { deleteUserSchema } from './validation';
import { deleteUserAccount } from './api';

export const deleteUserAction = async (
  _prevState: ProfileFormState | null,
  formData: FormData
): Promise<ProfileFormState | null> => {
  const session = await getSession();
  if (!session?.userId) redirect(routes.auth.login);

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
    await deleteSession();
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
