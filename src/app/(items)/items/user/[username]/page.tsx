import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Suspense } from 'react';

import { getUserProfileByUsername, getUserProducts } from '@/features/items/user/api';
import { UserProfileHeader } from '@/features/items/user/components/UserProfileHeader';
import { ProductsGrid } from '@/features/items/_shared/components/ProductsGrid';
import { ProductsGridSkeleton } from '@/features/items/_shared/components/ProductsGridSkeleton';
import { getSession } from '@/infrastructure/auth/session';
import { PRODUCTS_PER_PAGE } from '@/utils/constants';

interface UserProfilePageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ page?: string; query?: string }>;
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> => {
  const { username } = await params;
  const user = await getUserProfileByUsername(username);
  if (!user) {
    return {
      title: 'User Not Found — BiciPop',
    };
  }

  return {
    title: `${user.username}'s Profile — BiciPop`,
    description: `View ${user.username}'s profile and products on BiciPop`,
  };
};

export const dynamic = 'force-dynamic';

const ProductsGridWrapper = async ({
  username,
  searchParams,
}: {
  username: string;
  searchParams: Promise<{ page?: string; query?: string }>;
}) => {
  const { page: pageParam, query } = await searchParams;
  const page = pageParam ? parseInt(pageParam, 10) : 1;

  const session = await getSession();
  const userId = session?.userId;

  const result = await getUserProducts(username, userId, {
    page,
    pageSize: PRODUCTS_PER_PAGE,
    query,
  });

  const totalPages = Math.ceil(result.totalCount / PRODUCTS_PER_PAGE);

  return (
    <ProductsGrid
      products={result.items}
      currentPage={page}
      totalPages={totalPages}
      emptyMessage={{
        title: `No products yet`,
        description: `${username} hasn't posted any products.`,
        showLink: false,
      }}
    />
  );
};

const UserProfilePage = async ({ params, searchParams }: UserProfilePageProps) => {
  const { username } = await params;

  const profile = await getUserProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <UserProfileHeader
        username={profile.username}
        productsCount={profile.productsCount}
        createdAt={profile.createdAt}
      />
      <div>
        <h2 className="text-2xl font-bold mb-6">Products by {profile.username}</h2>
        <Suspense fallback={<ProductsGridSkeleton />}>
          <ProductsGridWrapper username={username} searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
};

export default UserProfilePage;
