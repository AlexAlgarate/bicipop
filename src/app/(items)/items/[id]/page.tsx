import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProductDetailView } from '@/features/items/detail/components/ProductDetailView';
import { getSession } from '@/infrastructure/auth/session';
import { getProductDetailData } from '@/features/items/detail/api';

interface ProductDetailProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export const generateMetadata = async ({
  params,
}: ProductDetailProps): Promise<Metadata | null> => {
  const { id } = await params;
  const data = await getProductDetailData(id, null);
  if (!data) return null;

  return {
    title: data.product.title,
    description: data.product.description.slice(0, 160),
    openGraph: {
      title: data.product.title,
      description: data.product.description.slice(0, 160),
      images: [data.product.imageUrl],
    },
  };
};

export const ProductDetailPage = async ({ params }: ProductDetailProps) => {
  const { id } = await params;

  const session = await getSession();
  const userId = session?.userId ?? null;

  const data = await getProductDetailData(id, userId);
  if (!data) notFound();

  return (
    <ProductDetailView product={data.product} relatedProducts={data.relatedProducts} />
  );
};

export default ProductDetailPage;
