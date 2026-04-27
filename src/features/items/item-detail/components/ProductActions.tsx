import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

import type { ProductDTO } from '@/domain/products/types';
import { ProductStatus } from '@/generated/client/enums';
import { routes } from '@/utils/constants';

interface ProductActionsProps {
  product: ProductDTO;
  isOwner: boolean;
}

export const ProductActions = ({ product, isOwner }: ProductActionsProps) => {
  const isSold = product.status === ProductStatus.SOLD;
  return (
    <div className="flex gap-3">
      {isOwner ? (
        <>
          <Link
            href={`${routes.items.edit}/${product.id}`}
            className="btn btn-primary flex-1 py-3"
          >
            Edit Product
          </Link>
        </>
      ) : (
        <>
          <button className="btn btn-primary flex-1 gap-2 py-3" disabled={isSold}>
            <MessageCircle className="h-5 w-5" />
            Contact Seller
          </button>
        </>
      )}
    </div>
  );
};
