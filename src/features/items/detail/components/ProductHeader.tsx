import Link from 'next/link';

import type { ProductDTO } from '@/domain/products/types';
import { ProductStatus } from '@/generated/client/enums';
import { formatPrice } from '@/utils/format';
import { routes } from '@/config/routes';

interface ProductHeaderProps {
  product: ProductDTO;
}

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

export const ProductHeader = ({ product }: ProductHeaderProps) => {
  const productStatus = STATUS_CONFIG[product.status];

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Link
          href={`${routes.category}/${product.categorySlug}`}
          className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary"
        >
          {product.categoryName}
        </Link>
        {productStatus && (
          <span className={`rounded-full px-3 py-1 font-medium ${productStatus.color}`}>
            {productStatus.label}
          </span>
        )}
      </div>
      <h1 className="text-3xl font-bold">{product.title}</h1>
      <p className="mt-4 text-4xl font-bold text-primary">{formatPrice(product.price)}</p>
    </div>
  );
};
