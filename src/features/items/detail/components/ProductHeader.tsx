'use client';

import Link from 'next/link';
import { Share, Star } from 'lucide-react';
import { useState } from 'react';

import { ProductStatus } from '@/generated/client/enums';
import { formatPrice } from '@/utils/format';
import { routes } from '@/config/routes';
import type { ProductDetailProps } from '@/features/items/detail/types';

import { useFavorite } from '../../_shared/hooks/useFavorite';

import { ShareModal } from './ShareProduct';

const STATUS_CONFIG: Partial<Record<ProductStatus, { label: string; color: string }>> = {
  [ProductStatus.RESERVED]: {
    label: 'Reserved',
    color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20',
  },
  [ProductStatus.SOLD]: {
    label: 'Sold',
    color: 'bg-red-100 text-red-600 dark:bg-red-900/20',
  },
};

export const ProductHeader = ({ product }: ProductDetailProps) => {
  const [shareOpen, setShareOpen] = useState(false);
  const productStatus = STATUS_CONFIG[product.status];

  const { handleToogle, isFavorite, isPending } = useFavorite({
    productId: product.id,
    isLiked: product.isLiked ?? false,
    isOwner: product.isOwner ?? false,
  });

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={routes.category(product.categorySlug)}
            className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:text-sm"
          >
            {product.categoryName}
          </Link>
          {productStatus && (
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${productStatus.color}`}
            >
              {productStatus.label}
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {!product.isOwner && (
            <button
              onClick={handleToogle}
              disabled={isPending}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className={`rounded-full p-2 transition-all duration-200 cursor-pointer
                ${
                  isFavorite
                    ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10'
                    : 'text-muted hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-500/10'
                }
                `}
            >
              <Star className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}
          <button
            onClick={() => setShareOpen(true)}
            aria-label="Share"
            className="rounded-full p-2 text-muted hover:text-primary hover:bg-primary/10 transition-all duration-200 cursor-pointer"
          >
            <Share className="h-5 w-5" />
          </button>
        </div>
      </div>

      <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">{product.title}</h1>
      <p className="mt-3 text-3xl font-bold text-primary sm:mt-4 sm:text-4xl">
        {formatPrice(product.price)}
      </p>

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        title={product.title}
        url={shareUrl}
      />
    </div>
  );
};
