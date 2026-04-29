import type { Metadata } from 'next';

import {
  getProductDetailData,
  ProductDetailView,
} from '@/features/items/detail/components/ProductDetailView';
import { getSession } from '@/infrastructure/auth/session';

interface ProductDetailProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: ProductDetailProps): Promise<Metadata> {
  const { id } = await params;
  const { product } = await getProductDetailData(id, null);

  return {
    title: product.title,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160),
      images: [product.imageUrl],
    },
  };
}

export const ProductDetailPage = async ({ params }: ProductDetailProps) => {
  const { id } = await params;

  const session = await getSession();
  const userId = session?.userId ?? null;

  const { product, relatedProducts } = await getProductDetailData(id, userId);

  return <ProductDetailView product={product} relatedProducts={relatedProducts} />;
};

export default ProductDetailPage;
