import { Clock, MapPin, Tag } from 'lucide-react';

import { formatDate } from '@/utils/format';
import type { ProductWithUserContext } from '@/domain/products/types';

export const ProductMetaInfo = ({ product }: { product: ProductWithUserContext }) => {
  return (
    <div className="flex flex-wrap gap-4 text-sm text-muted">
      <span className="flex items-center gap-1">
        <MapPin className="h-4 w-4" />
        {product.location}
      </span>
      <span className="flex items-center gap-1">
        <Clock className="h-4 w-4" />
        {formatDate(product.createdAt)}
      </span>
      <span className="flex items-center gap-1">
        <Tag className="h-4 w-4" />
        {product.categoryName}
      </span>
    </div>
  );
};
