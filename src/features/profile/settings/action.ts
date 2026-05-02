'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { SESSION_COOKIE_NAME } from '@/infrastructure/auth/constants';
import { routes } from '@/config/routes';
import { getCurrentUser } from '@/features/auth/api';

import { deleteUser } from './api';

export const deleteUserAction = async () => {
  const user = await getCurrentUser();

  if (!user) throw new Error('USer not found');

  await deleteUser();

  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);

  revalidatePath(routes.home);
  redirect(routes.home);
};
