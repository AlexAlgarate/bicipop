import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { getUserProfileByUsername, getUserProducts } from '@/features/user-profile/api';
import { UserProfileHeader } from '@/features/user-profile/components/UserProfileHeader';
import { ProductsGrid } from '@/features/items/_shared/components/ProductsGrid';
import { PRODUCTS_PER_PAGE } from '@/utils/constants';

interface UserProfilePageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ page?: string; query?: string }>;
}

export const generateMetada = async ({
  params,
}: UserProfilePageProps): Promise<Metadata> => {
  const { username } = await params;
  const user = await getUserProfileByUsername(username);
  if (!user) {
    return {
      title: 'User Not Found',
    };
  }

  return {
    title: `${user.username}'s Profile`,
    description: `View ${user.username}'s profile and products on BiciPop`,
  };
};

export const dynamic = 'force-dynamic';

export default async function UserProfilePage({
  params,
  searchParams,
}: UserProfilePageProps) {
  const { username } = await params;
  const { page: pageParam, query } = await searchParams;
  const page = pageParam ? parseInt(pageParam, 10) : 1;

  const [profile, result] = await Promise.all([
    getUserProfileByUsername(username),
    getUserProducts(username, null, { page, pageSize: PRODUCTS_PER_PAGE, query }),
  ]);

  if (!profile) {
    notFound();
  }

  const totalPages = Math.ceil(result.totalCount / PRODUCTS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
      <UserProfileHeader
        username={profile.username}
        productsCount={profile.productsCount}
        createdAt={profile.createdAt}
      />
      <div>
        <h2 className="text-2xl font-bold mb-6">Products by {profile.username}</h2>
        <ProductsGrid
          products={result.items}
          currentPage={page}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}