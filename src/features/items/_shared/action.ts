'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getSession } from '@/infrastructure/auth/session';
import { routes } from '@/utils/constants';
import { getProductByOwner, toggleFavorite } from '@/features/items/_shared/api';

export const toggleFavoriteAction = async (
  productId: string
): Promise<{ liked: boolean }> => {
  const session = await getSession();
  if (!session?.userId) redirect('/login');

  const ad = await getProductByOwner(productId, session.userId);
  if (ad) {
    throw new Error('Cannot favorite your own product');
  }

  const result = await toggleFavorite(session.userId, productId);
  revalidatePath(`${routes.items.detail}/${productId}`);
  revalidatePath(routes.home);

  return result;
};
