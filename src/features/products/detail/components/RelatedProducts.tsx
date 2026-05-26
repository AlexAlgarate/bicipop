import type { ProductWithUserContext } from '@/domain/products/types';
import { ProductsGrid } from '@/features/products/_shared/components/ProductsGrid';

interface RelatedProductsProps {
  relatedProducts: ProductWithUserContext[];
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
