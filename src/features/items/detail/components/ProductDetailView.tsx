import { BackToPageLink } from '@/components/ui/BackToPageLink';
import type { ProductWithUserContext } from '@/domain/products/types';

import { ProductImage } from './ProductImage';
import { ProductHeader } from './ProductHeader';
import { ProductMetaInfo } from './ProductMetaInfo';
import { ProductSellerInfo } from './ProductSellerInfo';
import { ProductActions } from './ProductActions';
import { RelatedProducts } from './RelatedProducts';
interface ProductDetailViewProps {
  product: ProductWithUserContext;
  relatedProducts: ProductWithUserContext[];
}

export const ProductDetailView = ({
  product,
  relatedProducts,
}: ProductDetailViewProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <BackToPageLink />

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
          <ProductActions product={product} />
        </div>
      </div>

      <RelatedProducts relatedProducts={relatedProducts} />
    </div>
  );
};
