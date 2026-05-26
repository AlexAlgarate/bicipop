'use client';

import Link from 'next/link';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useTransition } from 'react';

import { ProductStatus } from '@/generated/client/enums';
import { routes } from '@/config/routes';
import { startConversationAction } from '@/features/profile/messages/actions';
import type { ProductWithUserContext } from '@/domain/products/types';

interface ProductActionsProps {
  product: ProductWithUserContext;
}

export const ProductActions = ({ product }: ProductActionsProps) => {
  const [isPending, startTransition] = useTransition();
  const isSold = product.status === ProductStatus.SOLD;

  const handleContact = () => {
    startTransition(async () => {
      await startConversationAction(product.id);
    });
  };

  if (product.isOwner) {
    return (
      <div className="flex gap-3">
        <Link
          href={routes.products.edit(product.id)}
          className="btn btn-primary flex-1 py-3"
        >
          Edit Product
        </Link>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={handleContact}
        disabled={isSold || isPending}
        className="btn btn-primary flex-1 gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <MessageCircle className="h-5 w-5" />
        )}
        {isSold ? 'Sold' : 'Contact Seller'}
      </button>
    </div>
  );
};
