import { ProductsGrid } from '@/features/items/_shared/components/ProductsGrid';
import type { ProductsWithFavoriteStatus } from '@/domain/products/types';

interface RelatedProductsProps {
  relatedProducts: ProductsWithFavoriteStatus[];
}

export const RelatedProducts = ({ relatedProducts }: RelatedProductsProps) => {
  return (
    <>
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">Similar Products</h2>
          <ProductsGrid products={relatedProducts} currentPage={1} totalPages={1} />
        </section>
      )}
    </>
  );
};
