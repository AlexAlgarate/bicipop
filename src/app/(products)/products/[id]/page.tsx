import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { ProductDetailView } from '@/features/products/detail/components/ProductDetailView';
import { ProductDetailSkeleton } from '@/features/products/detail/components/ProductDetailSkeleton';
import { getSession } from '@/infrastructure/auth/session';
import { getProductDetailData } from '@/features/products/detail/api';

interface ProductDetailProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata | null> => {
  const { id } = await params;
  const data = await getProductDetailData(id, null);
  if (!data) return null;

  return {
    title: `${data.product.title} — BiciPop`,
    description: data.product.description.slice(0, 160),
    openGraph: {
      title: `${data.product.title} — BiciPop`,
      description: data.product.description.slice(0, 160),
      images: [data.product.imageUrl],
    },
  };
};

const ProductDetailWrapper = async ({ params }: ProductDetailProps) => {
  const { id } = await params;

  const session = await getSession();
  const userId = session?.userId ?? null;

  const data = await getProductDetailData(id, userId);
  if (!data) notFound();

  return (
    <ProductDetailView product={data.product} relatedProducts={data.relatedProducts} />
  );
};

export const ProductDetailPage = async ({ params }: ProductDetailProps) => {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailWrapper params={params} />
    </Suspense>
  );
};

export default ProductDetailPage;
