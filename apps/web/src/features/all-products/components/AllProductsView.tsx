import { HeroSection } from './HeroSection';
import { FiltersPanel } from './FiltersPanel';
import { getCategories } from '@/features/shared/api/get-categories';

interface AllProductsViewProps {
  children: React.ReactNode;
  searchParams?: {
    toString?: () => string;
    query?: string;
    order?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  };
}

export const AllProductsView = async ({
  children,
  searchParams,
}: AllProductsViewProps) => {
  const categories = await getCategories();

  return (
    <div className="pb-20 space-y-12">
      <HeroSection />

      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-foreground tracking-tight mb-8">
          Novedades en BiciPop
        </h2>

        <div className="flex gap-8 items-start">
          <div className="hidden lg:block w-64 shrink-0 sticky top-6">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <FiltersPanel
                key={searchParams?.toString?.() ?? 'default'}
                categories={categories}
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </section>
    </div>
  );
};
