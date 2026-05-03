import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { routes } from '@/config/routes';
import { getUserFavorites } from '@/features/profile/favorites/api';
import { ProductsGrid } from '@/features/items/_shared/components/ProductsGrid';
import { getCurrentUser } from '@/features/auth/api';
import { FavoritesHeader } from '@/features/profile/favorites/components/FavoritesHeader';
import { PRODUCTS_PER_PAGE } from '@/utils/constants';

export const metadata: Metadata = {
  title: 'Favorites',
  description: 'Your favorite products on Bicipop',
};

export const dynamic = 'force-dynamic';

interface FavoritesPageProps {
  page?: string;
  query?: string;
}

const FavoritesPage = async ({
  searchParams,
}: {
  searchParams: Promise<FavoritesPageProps>;
}) => {
  const user = await getCurrentUser();
  if (!user) redirect(routes.auth.login);
  const userId = user.id as string;

  const { page, query } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;

  const data = await getUserFavorites(userId, {
    page: currentPage,
    pageSize: PRODUCTS_PER_PAGE,
    query,
  });

  const totalPages = Math.ceil(data.totalCount / PRODUCTS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
      <FavoritesHeader username={user.username} />
      <ProductsGrid
        products={data.items}
        currentPage={currentPage}
        totalPages={totalPages}
        emptyMessage={{
          title: 'No favorites yet',
          description: 'Browse the catalog and save products you like!',
          showLink: true,
        }}
      />
    </div>
  );
};

export default FavoritesPage;
