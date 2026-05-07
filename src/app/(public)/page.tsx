import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { HeroSection } from '@/features/items/list/components/HeroSection';
import { routes } from '@/config/routes';
import { ProductsGrid } from '@/features/items/_shared/components/ProductsGrid';
import { getProducts } from '@/features/items/list/api';
import { getSession } from '@/infrastructure/auth/session';
import { PRODUCTS_PER_PAGE } from '@/utils/constants';

export const metadata: Metadata = {
  title: 'BiciPop',
  description: 'Página de compraventa de bicicletas de segunda mano.',
};

const HomePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; query: string }>;
}) => {
  const { page: pageParam, query } = await searchParams;
  const page = pageParam ? parseInt(pageParam, 10) : 1;

  const session = await getSession();
  const userId = session?.userId;

  const {
    items: products,
    currentPage,
    totalPages,
  } = await getProducts(
    {
      page,
      pageSize: PRODUCTS_PER_PAGE,
      order: 'desc',
      query: query,
    },
    userId
  );

  return (
    <div className="pb-20 space-y-12">
      <HeroSection />

      <section className="container mx-auto px-4 py-8">
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
};

export default HomePage;
