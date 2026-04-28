import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getProductById } from '@/features/items/_shared/api';
import { getRelatedProducts } from '@/features/items/detail/api';
import { getSession } from '@/infrastructure/auth/session';
import { ProductImage } from '@/features/items/detail/components/ProductImage';
import { ProductHeader } from '@/features/items/detail/components/ProductHeader';
import { ProductMetaInfo } from '@/features/items/detail/components/ProductMetaInfo';
import { ProductSellerInfo } from '@/features/items/detail/components/ProductSellerInfo';
import { ProductActions } from '@/features/items/detail/components/ProductActions';
import { RelatedProducts } from '@/features/items/detail/components/RelatedProducts';
import { BackToHomeLink } from '@/components/BackToHomeLink';
import { routes } from '@/utils/constants';

interface ProductDetailProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: ProductDetailProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

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
  const userId = session?.userId;

  const product = await getProductById(id, userId);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts({
    categoryId: product.categoryId,
    excludeId: product.id,
    excludeUserId: product.userId,
    limit: 4,
    currentUserId: userId,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <BackToHomeLink title="dashboard" url={routes.dashboard} />

      <div className="grid gap-8 lg:grid-cols-2">
        <ProductImage product={product} />

        <div className="space-y-6">
          <ProductHeader product={product} />
          <ProductMetaInfo product={product} />

          <div>
            <h2 className="mb-2 text-lg font-semibold">Description</h2>
            <p className="whitespace-pre-line text-muted">{product.description}</p>
          </div>

          <ProductSellerInfo product={product} />
          <ProductActions product={product} isOwner={product.isOwner} />
        </div>
      </div>

      <RelatedProducts relatedProducts={relatedProducts} />
    </div>
  );
};

export default ProductDetailPage;
