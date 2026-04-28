'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Edit, Trash2, MoreVertical, Loader2 } from 'lucide-react';

import type { ProductStatus } from '@/generated/client/enums';
import { formatPrice, timeAgo } from '@/utils/format';
import { routes } from '@/utils/constants';

import { deleteProductAction, updateProductStatusAction } from '../action';

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  location: string;
  status: ProductStatus;
  createdAt: Date;
  categoryName: string;
  categorySlug: string;
}

interface DashboardProductListProps {
  products: Product[];
}

export default function DashboardProductList({ products }: DashboardProductListProps) {
  return (
    <div className="mt-4 divide-y divide-border">
      {products.map(product => (
        <ProductRow key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductRow({ product }: { product: Product }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this product?')) {
      startTransition(async () => {
        await deleteProductAction(product.id);
      });
    }
  };

  const handleStatusChange = (status: ProductStatus) => {
    startTransition(async () => {
      await updateProductStatusAction(product.id, status);
    });
    setShowMenu(false);
  };

  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    RESERVED: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    SOLD: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  };

  return (
    <div className="flex items-center gap-4 py-4">
      {/* Image */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <Link
          href={`${routes.items.detail}/${product.id}`}
          className="font-medium hover:text-primary"
        >
          {product.title}
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
          <span>{formatPrice(product.price)}</span>
          <span className="text-border">|</span>
          <span>{product.categoryName}</span>
          <span className="text-border">|</span>
          <span>{timeAgo(product.createdAt)}</span>
        </div>
      </div>

      {/* Status */}
      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${
          statusColors[product.status]
        }`}
      >
        {product.status}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link
          href={`/items/edit/${product.id}`}
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

        {/* Status Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="btn btn-ghost p-2"
            title="More options"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-lg border border-border bg-card py-1 shadow-lg">
                <p className="px-3 py-1 text-xs font-medium text-muted">Change Status</p>
                {(['ACTIVE', 'RESERVED', 'SOLD'] as ProductStatus[]).map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={product.status === status || isPending}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-(--card-hover) disabled:opacity-50"
                  >
                    <span
                      className={`mr-2 inline-block h-2 w-2 rounded-full ${
                        status === 'ACTIVE'
                          ? 'bg-green-500'
                          : status === 'RESERVED'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                    />
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
