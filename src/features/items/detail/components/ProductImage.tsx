import Image from 'next/image';

import { ProductStatus } from '@/generated/client/enums';
import type { ProductWithUserContext } from '@/domain/products/types';

const STATUS_CONFIG: Partial<Record<ProductStatus, { label: string; color: string }>> = {
  [ProductStatus.RESERVED]: { label: 'Reserved', color: 'text-yellow-500' },
  [ProductStatus.SOLD]: { label: 'Sold', color: 'text-red-500' },
};

export const ProductImage = ({ product }: { product: ProductWithUserContext }) => {
  const productStatus = STATUS_CONFIG[product.status];

  return (
    <div className="relative aspect-square overflow-hidden rounded-2xl bg-card">
      <Image
        src={product.imageUrl}
        alt={product.title}
        fill
        className="object-cover"
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
        unoptimized
      />
      {productStatus && (
        <div className={`absolute inset-0 flex items-center justify-center bg-black/50 `}>
          <span
            className={`${productStatus.color} rounded-full bg-black/70 px-6 py-3 text-xl font-bold uppercase tracking-wide`}
          >
            {productStatus.label}
          </span>
        </div>
      )}
    </div>
  );
};
