'use server';

import { deleteAd, getAdByOwner, toggleFavorite } from '@/features/product/api';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const deleteAdAction = async (formData: FormData): Promise<never> => {
  const session = await getSession();
  if (!session?.userId) redirect('/login');

  const adId = String(formData.get('adId'));
  const ad = await getAdByOwner(adId, session.userId);

  if (!ad) redirect('/');

  await deleteAd(adId);

  revalidatePath('/');
  redirect('/');
};

export const toggleFavoriteAction = async (
  productId: string,
): Promise<{ liked: boolean; likesCount: number }> => {
  const session = await getSession();
  if (!session?.userId) redirect('/login');

  const ad = await getAdByOwner(productId, session.userId);
  if (ad) {
    throw new Error('Cannot like your own product');
  }

  const result = await toggleFavorite(session.userId, productId);
  revalidatePath(`/products/${productId}`);
  revalidatePath('/');

  return result;
};
