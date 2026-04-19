import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { BackToHomeLink } from '@/components/BackToHomeLink';
import { getCategories } from '@/features/shared/api/get-categories';
import { CreateAdForm } from '@/features/product-create/components/CreateProductForm';

const CreateAdPage = async () => {
  const session = await getSession();

  if (!session?.userId) {
    redirect('/login?callbackUrl=/products/create');
  }

  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <BackToHomeLink />
          <h1 className="text-3xl font-bold text-foreground mt-4">Vende tu bici</h1>
          <p className="text-muted-foreground mt-1">
            Completa los detalles para publicar tu anuncio en BiciPop.
          </p>
        </div>

        <div className="bg-card rounded-xl shadow-sm p-6 md:p-8">
          <CreateAdForm categories={categories} />
        </div>
      </div>
    </div>
  );
};

export default CreateAdPage;
