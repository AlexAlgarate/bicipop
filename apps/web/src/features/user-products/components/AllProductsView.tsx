import { HeroSectionUser } from './HeroSectionUser';
import { FiltersPanel } from '@/features/all-products/components/FiltersPanel';
import { getCategories } from '@/features/shared/api/get-categories';
import { ProductsSearchParams } from '@/features/shared/types/search-params.types';

interface AllProductsViewProps {
  children: React.ReactNode;
  searchParams: ProductsSearchParams;
}

export const AllProductsView = async ({
  children,
  searchParams,
}: AllProductsViewProps) => {
  const categories = await getCategories();

  return (
    <div className="pb-20 space-y-12">
      <HeroSectionUser />

      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-foreground tracking-tight mb-8">
          Mis anuncios
        </h2>

        <div className="flex gap-8 items-start">
          <div className="hidden lg:block w-64 shrink-0 sticky top-6">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <FiltersPanel key={searchParams.toString()} categories={categories} />
            </div>
          </div>
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </section>
    </div>
  );
};
