'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { type ProfileFormState } from '@/features/profile/settings/_shared/types';
import { getSession } from '@/infrastructure/auth/session';
import { routes } from '@/config/routes';
import { getFieldErrorsFromTree } from '@/utils/validation-errors';
import { isNextControlFlowError } from '@/utils/error-handler';
import { updateUserProfileSchema } from '@/features/profile/settings/update/validation';
import { updateUserProfile } from '@/features/profile/settings/update/api';

export const updateUserProfileAction = async (
  _prevState: ProfileFormState | null,
  formData: FormData
): Promise<ProfileFormState | null> => {
  const session = await getSession();

  if (!session?.userId) redirect(routes.auth.login);

  const rawValues = {
    email: String(formData.get('email')),
    username: String(formData.get('username')),
    password: String(formData.get('password')),
  };

  const parsed = updateUserProfileSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      success: false,
      message: 'There are errors in the form. Please correct them and try again',
      requestId: Date.now(),
      errors: getFieldErrorsFromTree(parsed.error),
      values: { email: rawValues.email, username: rawValues.username },
    };
  }

  try {
    await updateUserProfile({
      email: parsed.data.email,
      username: parsed.data.username,
      password: parsed.data.password,
    });
    revalidatePath(routes.profile.settings);
    redirect(routes.profile.settings);
  } catch (error) {
    if (isNextControlFlowError(error)) throw error;

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to update profile. Please try again',
      requestId: Date.now(),
      errors: error instanceof Error ? { general: [error.message] } : undefined,
      values: { email: rawValues.email, username: rawValues.username },
    };
  }
};
