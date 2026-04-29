'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getSession } from '@/infrastructure/auth/session';
import { routes } from '@/config/routes';
import { verifyProductOwnership, toggleFavorite } from '@/features/items/_shared/api';

export const toggleFavoriteAction = async (
  productId: string
): Promise<{ liked: boolean }> => {
  const session = await getSession();
  if (!session?.userId) redirect('/login');

  const product = await verifyProductOwnership(productId, session.userId);
  if (product) {
    throw new Error('Cannot favorite your own product');
  }

  const result = await toggleFavorite(session.userId, productId);
  revalidatePath(`${routes.items.detail}/${productId}`);
  revalidatePath(routes.home);

  return result;
};
