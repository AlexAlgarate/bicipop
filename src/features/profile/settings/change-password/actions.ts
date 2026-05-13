'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { type ProfileFormState } from '@/features/profile/settings/_shared/types';
import { getSession } from '@/infrastructure/auth/session';
import { routes } from '@/config/routes';
import { getFieldErrorsFromTree } from '@/utils/validation-errors';
import { isNextControlFlowError } from '@/utils/error-handler';
import { changePasswordSchema } from '@/features/profile/settings/change-password/validation';
import { changeUserPassword } from '@/features/profile/settings/change-password/api';

export const changePasswordAction = async (
  _prevState: ProfileFormState | null,
  formData: FormData
): Promise<ProfileFormState | null> => {
  const session = await getSession();
  if (!session?.userId) redirect(routes.auth.login);

  const rawValues = {
    currentPassword: String(formData.get('currentPassword')),
    newPassword: String(formData.get('newPassword')),
    confirmPassword: String(formData.get('confirmPassword')),
  };

  const parsed = changePasswordSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      success: false,
      message: 'Something was wrong. Check fields',
      requestId: Date.now(),
      errors: getFieldErrorsFromTree(parsed.error),
      values: rawValues,
    };
  }

  try {
    await changeUserPassword(parsed.data.currentPassword, parsed.data.newPassword);
    revalidatePath(routes.profile.settings);
    redirect(routes.profile.settings);
  } catch (error) {
    if (isNextControlFlowError(error)) throw error;

    return {
      success: false,
      message: 'Failed to change password. Please try again',
      requestId: Date.now(),
      errors: error instanceof Error ? { general: [error.message] } : undefined,
      values: rawValues,
    };
  }
};
