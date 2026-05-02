'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { SESSION_COOKIE_NAME } from '@/infrastructure/auth/constants';
import { routes } from '@/config/routes';
import { deleteUserAccount } from '@/features/profile/settings/delete/api';

export const deleteUserAction = async () => {
  await deleteUserAccount();

  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);

  revalidatePath(routes.home);
  redirect(routes.home);
};
