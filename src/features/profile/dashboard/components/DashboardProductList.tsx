'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Edit, Trash2, MoreVertical, Loader2 } from 'lucide-react';

import { ProductStatus } from '@/generated/client/enums';
import { formatPrice, formatDate } from '@/utils/format';
import { routes } from '@/config/routes';
import {
  deleteProductAction,
  updateProductStatusAction,
} from '@/features/profile/dashboard/actions';
import type { ProductsWithFavoriteStatus } from '@/features/items/_shared/types';

interface DashboardProductListProps {
  products: ProductsWithFavoriteStatus[];
}

const STATUS_CONFIG: Record<
  ProductStatus,
  { badge: string; dot: string; label: string }
> = {
  [ProductStatus.ACTIVE]: {
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    dot: 'bg-green-500',
    label: 'Active',
  },
  [ProductStatus.RESERVED]: {
    badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    dot: 'bg-yellow-500',
    label: 'Reserved',
  },
  [ProductStatus.SOLD]: {
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    dot: 'bg-red-500',
    label: 'Sold',
  },
};

const ALL_STATUSES = Object.values(ProductStatus);

export const DashboardProductList = ({ products }: DashboardProductListProps) => {
  return (
    <div className="mt-4 divide-y divide-border">
      {products.map(product => (
        <ProductRow key={product.id} product={product} />
      ))}
    </div>
  );
};

const ProductRow = ({ product }: { product: ProductsWithFavoriteStatus }) => {
  return (
    <div className="flex items-center gap-4 py-4">
      <ProductThumbnail title={product.title} imageUrl={product.imageUrl} />
      <ProductInfo product={product} />
      <ProductStatusBadge status={product.status} />
      <ProductActions product={product} />
    </div>
  );
};

const ProductThumbnail = ({ title, imageUrl }: { title: string; imageUrl: string }) => {
  return (
    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
      <Image src={imageUrl} alt={title} fill className="object-cover" sizes="64px" />
    </div>
  );
};

const ProductInfo = ({ product }: { product: ProductsWithFavoriteStatus }) => {
  return (
    <div className="min-w-0 flex-1">
      <Link
        href={routes.items.detail(product.id)}
        className="font-medium hover:text-primary"
      >
        {product.title}
      </Link>
      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
        <span>{formatPrice(product.price)}</span>
        <span className="text-border">|</span>
        <span>{product.categoryName}</span>
        <span className="text-border">|</span>
        <span>{formatDate(product.createdAt)}</span>
      </div>
    </div>
  );
};

const ProductStatusBadge = ({ status }: { status: ProductStatus }) => {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_CONFIG[status].badge}`}
    >
      {status}
    </span>
  );
};

const ProductActions = ({ product }: { product: ProductsWithFavoriteStatus }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    startTransition(async () => {
      await deleteProductAction(product.id);
    });
  };

  const handleStatusChange = (status: ProductStatus) => {
    startTransition(async () => {
      await updateProductStatusAction(product.id, status);
    });
    setShowMenu(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={routes.items.edit(product.id)}
        className="btn btn-ghost p-2"
        title="Edit"
      >
        <Edit className="h-4 w-4" />
      </Link>

      <button
        onClick={handleDelete}
        disabled={isPending}
        className="btn btn-ghost p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
        title="Delete"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </button>

      <StatusMenu
        currentStatus={product.status}
        isPending={isPending}
        showMenu={showMenu}
        onToggle={() => setShowMenu(!showMenu)}
        onStatusChange={handleStatusChange}
        onClose={() => setShowMenu(false)}
      />
    </div>
  );
};

const StatusMenu = ({
  currentStatus,
  isPending,
  showMenu,
  onToggle,
  onStatusChange,
  onClose,
}: {
  currentStatus: ProductStatus;
  isPending: boolean;
  showMenu: boolean;
  onToggle: () => void;
  onStatusChange: (status: ProductStatus) => void;
  onClose: () => void;
}) => {
  return (
    <div className="relative">
      <button onClick={onToggle} className="btn btn-ghost p-2" title="More options">
        <MoreVertical className="h-4 w-4" />
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={onClose} />
          <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-lg border border-border bg-card py-1 shadow-lg">
            <p className="px-3 py-1 text-xs font-medium text-muted">Change Status</p>
            {ALL_STATUSES.map(status => (
              <button
                key={status}
                onClick={() => onStatusChange(status)}
                disabled={currentStatus === status || isPending}
                className="w-full px-3 py-2 text-left text-sm hover:bg-(--card-hover) disabled:opacity-50"
              >
                <span
                  className={`mr-2 inline-block h-2 w-2 rounded-full ${STATUS_CONFIG[status].dot}`}
                />
                {STATUS_CONFIG[status].label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
