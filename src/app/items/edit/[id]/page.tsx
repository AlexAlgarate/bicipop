import { notFound, redirect } from 'next/navigation';

import { getCategories, getProductById } from '@/features/items/shared/api';
import ProductForm from '@/features/items/shared/components/ProductForm';
import { BackToHomeLink } from '@/components/BackToHomeLink';
import { routes } from '@/utils/constants';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

const EditProductPage = async ({ params }: EditProductPageProps) => {
  const { id } = await params;

  const [product, categories] = await Promise.all([getProductById(id), getCategories()]);

  if (!product) notFound();

  if (!product.isOwner) redirect('/dashboard');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Back link */}
        <BackToHomeLink title="dashboard" url={routes.dashboard} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="mt-2 text-muted">Update the details of your product listing</p>
        </div>

        <div className="bg-card rounded-xl shadow-sm p-6 md:p-8">
          <ProductForm
            categories={categories}
            mode="edit"
            initialData={{
              id: product.id,
              title: product.title,
              description: product.description,
              price: product.price,
              imageUrl: product.imageUrl,
              location: product.location,
              categoryId: product.categoryId,
              status: product.status,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
