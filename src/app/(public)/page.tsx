import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { HeroSection } from '@/features/items/items/components/HeroSection';
import { PRODUCTS_PER_PAGE, routes } from '@/utils/constants';
import { ProductsGrid } from '@/features/items/items/components/GridProducts';
import { getProducts } from '@/features/items/items/api';

export const metadata: Metadata = {
  title: 'BiciPop',
  description: 'Página de compraventa de bicicletas de segunda mano.',
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = pageParam ? parseInt(pageParam, 10) : 1;

  const {
    items: products,
    currentPage,
    totalPages,
  } = await getProducts({
    page,
    pageSize: PRODUCTS_PER_PAGE,
    order: 'desc',
    query: '',
  });

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
        <ProductsGrid
          products={products}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </section>
    </div>
  );
}
