import Link from 'next/link';
import { User } from 'lucide-react';

import { routes } from '@/config/routes';
import type { ProductWithUserContext } from '@/domain/products/types';

export const ProductSellerInfo = ({ product }: { product: ProductWithUserContext }) => {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:bg-card-hover">
      <Link
        href={routes.items.user(product.userName)}
        className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary/20 cursor-pointer"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft border border-border transition-colors hover:bg-primary-ring/30">
          <User className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-card-foreground">{product.userName}</p>
          <p className="text-sm text-muted-foreground">
            Member since{' '}
            {new Date(product.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </Link>
    </div>
  );
};
