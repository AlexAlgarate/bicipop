import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { getUserProfileByUsername, getUserProducts } from '@/features/items/user/api';
import { UserProfileHeader } from '@/features/items/user/components/UserProfileHeader';
import { ProductsGrid } from '@/features/items/_shared/components/ProductsGrid';
import { getSession } from '@/infrastructure/auth/session';
import { PRODUCTS_PER_PAGE } from '@/utils/constants';

interface UserProfilePageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ page?: string; query?: string }>;
}

export const generateMetadata = async ({
  params,
}: UserProfilePageProps): Promise<Metadata> => {
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

const UserProfilePage = async ({ params, searchParams }: UserProfilePageProps) => {
  const { username } = await params;
  const { page: pageParam, query } = await searchParams;
  const page = pageParam ? parseInt(pageParam, 10) : 1;

  const session = await getSession();
  const userId = session?.userId;

  const [profile, result] = await Promise.all([
    getUserProfileByUsername(username),
    getUserProducts(username, userId, { page, pageSize: PRODUCTS_PER_PAGE, query }),
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
          emptyMessage={{
            title: `No products yet`,
            description: `${profile.username} hasn't posted any products.`,
            showLink: false,
          }}
        />
      </div>
    </div>
  );
};

export default UserProfilePage;
