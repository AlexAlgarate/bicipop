import { Metadata } from 'next';
import { ProductDetailView } from '@/features/product/components/ProductDetailView';
import { getAdById } from '@/features/product/api';
import { Suspense } from 'react';
import { ProductDetail } from '@/features/product/components/ProductDetail';
import { SingleProductSkeleton } from '@/features/product/components/SingleProductSkeleton';

type ProductDetailParams = Promise<{
  id: string;
}>;

export const generateMetadata = async (props: {
  params: ProductDetailParams;
}): Promise<Metadata> => {
  const { id } = await props.params;

  const product = await getAdById(id);

  return {
    title: product
      ? `Bici: ${product.title} -- ${product.price} €`
      : 'Producto no encontrado',
    description: product
      ? `Detalles de la bicicleta: ${product.title}`
      : 'Producto no encontrado',
  };
};

const ProductDetailPage = async (props: { params: ProductDetailParams }) => {
  const { id } = await props.params;

  return (
    <ProductDetailView>
      <Suspense fallback={<SingleProductSkeleton />}>
        <ProductDetail id={id} />
      </Suspense>
    </ProductDetailView>
  );
};

export default ProductDetailPage;
