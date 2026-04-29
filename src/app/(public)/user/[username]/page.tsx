import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { getUserProfileByUsername, getUserProducts } from '@/features/user-profile/api';
import { UserProfileHeader } from '@/features/user-profile/components/UserProfileHeader';
import { ProductsGrid } from '@/features/items/_shared/components/ProductsGrid';

interface UserProfilePageProps {
  params: Promise<{ username: string }>;
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
    description: `View ${user.username}'s profile and products on Wallapop`,
  };
};

export const dynamic = 'force-dynamic';

export const UserProfilePage = async ({ params }: UserProfilePageProps) => {
  const { username } = await params;

  const [profile, products] = await Promise.all([
    getUserProfileByUsername(username),
    getUserProducts(username),
  ]);

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
        <ProductsGrid products={products} currentPage={1} totalPages={1} />
      </div>
    </div>
  );
};

export default UserProfilePage;
