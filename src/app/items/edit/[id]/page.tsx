import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { getCategories, getProductById } from '@/features/items/shared/api';
import { getCurrentUser } from '@/infrastructure/auth/session';
import ProductForm from '@/features/items/shared/components/ProductForm';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

const EditProductPage = async ({ params }: EditProductPageProps) => {
  const { id } = await params;

  const [product, categories, currentUser] = await Promise.all([
    getProductById(id),
    getCategories(),
    getCurrentUser(),
  ]);

  if (!product) notFound();

  if (!currentUser) redirect('/login');

  if (product.userId !== currentUser.id) redirect('/dashboard');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

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
