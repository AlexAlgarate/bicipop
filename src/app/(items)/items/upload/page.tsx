export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

import { BackToPageLink } from '@/components/ui/BackToPageLink';
import ProductForm from '@/features/items/_shared/components/ProductForm';
import { getCategories } from '@/features/items/_shared/api';

export const metadata: Metadata = {
  title: 'Upload Product — BiciPop',
  description: 'List a new product for sale on BiciPop',
};

export const UploadProductPage = async () => {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <BackToPageLink />
          <h1 className="text-3xl font-bold text-foreground mt-4">Upload Product</h1>
          <p className="text-muted-foreground mt-1">
            Fill in the details below to list your product for sale in Bicipop.
          </p>
        </div>

        <div className="bg-card rounded-xl shadow-sm p-6 md:p-8">
          <ProductForm categories={categories} mode="create" />
        </div>
      </div>
    </div>
  );
};

export default UploadProductPage;
