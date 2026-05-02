import { notFound } from 'next/navigation';

import { BackToHomeLink } from '@/components/BackToHomeLink';
import { routes } from '@/config/routes';
import { getProductById } from '@/features/items/_shared/api';
import { getRelatedProducts } from '@/features/items/detail/api';
import type { ProductsWithFavoriteStatus } from '@/features/items/_shared/types';

import { ProductImage } from './ProductImage';
import { ProductHeader } from './ProductHeader';
import { ProductMetaInfo } from './ProductMetaInfo';
import { ProductSellerInfo } from './ProductSellerInfo';
import { ProductActions } from './ProductActions';
import { RelatedProducts } from './RelatedProducts';
interface ProductDetailViewProps {
  product: ProductsWithFavoriteStatus;
  relatedProducts: ProductsWithFavoriteStatus[];
}

export const ProductDetailView = ({
  product,
  relatedProducts,
}: ProductDetailViewProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <BackToHomeLink title="dashboard" url={routes.profile.dashboard} />

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

export const getProductDetailData = async (id: string, userId: string | null) => {
  const product = await getProductById(id, userId);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts({
    categoryId: product.categoryId,
    excludeId: product.id,
    excludeUserId: product.userId,
    limit: 4,
    currentUserId: userId,
  });

  return { product, relatedProducts };
};
