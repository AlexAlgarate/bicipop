import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { HeroSection } from '@/features/items/items/components/HeroSection';
import { routes } from '@/utils/constants';
import { ProductsGrid } from '@/features/items/items/components/GridProducts';
import { parseProductsSearchParams } from '@/features/items/shared/utils/parse-search-params';
import type { ProductsPageSearchParams } from '@/features/items/shared/types/search-params.types';

export const metadata: Metadata = {
  title: 'BiciPop',
  description: 'Página de compraventa de bicicletas de segunda mano.',
};

export default async function Home({
  searchParams,
}: {
  searchParams: ProductsPageSearchParams;
}) {
  const params = parseProductsSearchParams(await searchParams);

  return (
    <div className="pb-20 space-y-12">
      <HeroSection />

      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground tracking-tight mb-6">
            Latest Products
          </h2>
          <Link
            href={routes.search}
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ProductsGrid {...params} />
      </section>
    </div>
  );
}
