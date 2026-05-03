import { notFound, redirect } from 'next/navigation';

import { getCategories, getProductById } from '@/features/items/_shared/api';
import ProductForm from '@/features/items/_shared/components/ProductForm';
import { BackToPageLink } from '@/components/ui/BackToPageLink';
import { routes } from '@/config/routes';
import { getSession } from '@/infrastructure/auth/session';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

const EditProductPage = async ({ params }: EditProductPageProps) => {
  const { id } = await params;
  const session = await getSession();
  const userId = session?.userId;

  const [product, categories] = await Promise.all([
    getProductById(id, userId),
    getCategories(),
  ]);

  if (!product) notFound();

  if (!product.isOwner) redirect(routes.profile.dashboard);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Back link */}
        <BackToPageLink />

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
