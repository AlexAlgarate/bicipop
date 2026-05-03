import { Plus } from 'lucide-react';
import Link from 'next/link';

import { routes } from '@/config/routes';

export const FavoritesHeader = ({ username }: { username: string }) => {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold">Favorites</h1>
        <p className="mt-1 text-muted">
          Welcome back, {username}! Manage your favorites here.
        </p>
      </div>
      <Link href={routes.items.upload} className="btn btn-primary gap-2 px-6 py-3">
        <Plus className="h-5 w-5" />
        Upload Product
      </Link>
    </div>
  );
};
