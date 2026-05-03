import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

import { ProductStatus } from '@/generated/client/enums';
import { routes } from '@/config/routes';
import type { ProductDetailProps } from '@/features/items/detail/types';

export const ProductActions = ({ product }: ProductDetailProps) => {
  const isSold = product.status === ProductStatus.SOLD;
  return (
    <div className="flex gap-3">
      {product.isOwner ? (
        <Link
          href={routes.items.edit(product.id)}
          className="btn btn-primary flex-1 py-3"
        >
          Edit Product
        </Link>
      ) : (
        <button className="btn btn-primary flex-1 gap-2 py-3" disabled={isSold}>
          <MessageCircle className="h-5 w-5" />
          Contact Seller
        </button>
      )}
    </div>
  );
};
