import { notFound } from 'next/navigation';
import { getAdWithFavoriteStatus } from '../api';
import { ProductImageSection } from './image-column/ProductImageSection';
import { ProductInfoSection } from './info-column/ProductInfoSection';
import { getSession } from '@/lib/auth';

interface Props {
  id: string;
}

export const ProductDetail = async ({ id }: Props) => {
  const session = await getSession();
  const userId = session?.userId ?? null;

  const product = await getAdWithFavoriteStatus(id, userId);

  if (!product) return notFound();

  return (
    <>
      <ProductImageSection product={product} />
      <ProductInfoSection product={product} />
    </>
  );
};
