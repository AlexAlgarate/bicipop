import { ProductsGrid } from '@/features/items/items/components/GridProducts';
import type { ProductsWithFavoriteStatus } from '@/features/items/shared/api';

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
