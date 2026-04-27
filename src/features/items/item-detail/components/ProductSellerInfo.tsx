import Link from 'next/link';
import { User } from 'lucide-react';

import type { ProductDTO } from '@/domain/products/types';
import { routes } from '@/utils/constants';

interface SellerInfoProps {
  product: ProductDTO;
}

export const ProductSellerInfo = ({ product }: SellerInfoProps) => {
  return (
    <div className="card">
      <h2 className="mb-3 pl-2 text-lg font-semibold">Seller</h2>
      <Link
        href={`${routes.profile}/${product.userId}`}
        className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-card-hover cursor-pointer"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 hover:bg-border/20 border-border">
          <User className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="font-medium text-lg">{product.userName}</p>
          <p className="text-muted">
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
