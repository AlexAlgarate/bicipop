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
import { Button } from '@/components/ui/Button';
import type { DashboardProductProps } from '@/features/profile/dashboard/types';
import type { ProductWithUserContext } from '@/domain/products/types';

const STATUS_CONFIG: Record<
  ProductStatus,
  { badge: string; dot: string; label: string }
> = {
  [ProductStatus.ACTIVE]: {
    badge: 'bg-green-500/10 text-green-400 ring-1 ring-green-500/20',
    dot: 'bg-green-500',
    label: 'Active',
  },
  [ProductStatus.RESERVED]: {
    badge: 'bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/20',
    dot: 'bg-yellow-500',
    label: 'Reserved',
  },
  [ProductStatus.SOLD]: {
    badge: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
    dot: 'bg-red-500',
    label: 'Sold',
  },
};

const ALL_STATUSES = Object.values(ProductStatus);

export const DashboardProductList = ({ products }: DashboardProductProps) => (
  <div className="divide-y divide-border">
    {products.map(product => (
      <ProductRow key={product.id} product={product} />
    ))}
  </div>
);

const ProductRow = ({ product }: { product: ProductWithUserContext }) => (
  <div className="flex items-stretch gap-3 py-3 px-2 rounded-lg hover:bg-background/20 transition-colors group">
    <Link
      href={routes.items.detail(product.id)}
      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg"
    >
      <Image
        src={product.imageUrl}
        alt={product.title}
        fill
        className="object-cover"
        sizes="80px"
      />
    </Link>
    <div className="flex flex-1 min-w-0 justify-between gap-2">
      <div className="flex flex-col justify-between min-w-0">
        <Link
          href={routes.items.detail(product.id)}
          className="truncate font-medium hover:text-primary leading-snug text-sm sm:text-base"
        >
          {product.title}
        </Link>
        <span className="font-medium text-foreground text-sm sm:text-base">
          {formatPrice(product.price)}
        </span>

        <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted">
          <span>{product.categoryName}</span>
          <span className="text-border">·</span>
          <span>{formatDate(product.createdAt)}</span>{' '}
        </div>
      </div>
      <div className="flex flex-col items-end justify-between shrink-0">
        <span
          className={`rounded-full px-2 py-0.5 text-xs sm:text-base font-medium ${STATUS_CONFIG[product.status].badge}`}
        >
          {STATUS_CONFIG[product.status].label}
        </span>
        <ProductActions product={product} />
      </div>
    </div>
  </div>
);

const ProductActions = ({ product }: { product: ProductWithUserContext }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);

  const handleStatusChange = (status: ProductStatus) => {
    setShowMenu(false);
    startTransition(async () => {
      await updateProductStatusAction(product.id, status);
    });
  };

  return (
    <div className="flex shrink-0 items-center">
      <Link
        href={routes.items.edit(product.id)}
        className="p-1.5 rounded-md text-muted hover:text-primary hover:bg-primary/10 transition-colors"
        title="Edit"
      >
        <Edit className="h-4 w-4" />
      </Link>
      <>
        <Button
          onClick={() => setShowModal(true)}
          disabled={isPending}
          className="p-1.5 rounded-md text-muted hover:text-destructive hover:bg-red-500/10 transition-colors disabled:opacity-50"
          title="Delete"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
        {showModal && (
          <div className=" fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50 shadow-lg"
              onClick={() => setShowModal(false)}
            ></div>

            <div className="relative z-10 bg-card border border-border rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
              <h2 className="text-lg font-semibold mb-2">Eliminar anuncio</h2>
              <p className=" text-sm text-muted-foreground mb-6">
                ¿Estás seguro de que quieres eliminar el anuncio? Esta acción no se puede
                deshacer.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowModal(false)}
                  className="
                flex-1 flex items-center justify-center gap-2
                border border-gary-200 hover:bg-gray-200 hover:border-gray-400
                text-gay-700 font-medium py-2.5 rounded-lg
              dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800
                "
                >
                  Cancelar
                </Button>
                <form
                  action={async (_formData: FormData) => {
                    await deleteProductAction(product.id);
                  }}
                  className="flex-1"
                >
                  <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg"
                  >
                    Sí, eliminar
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}
      </>
      <StatusMenu
        currentStatus={product.status}
        isPending={isPending}
        isOpen={showMenu}
        onToggle={() => setShowMenu(prev => !prev)}
        onStatusChange={handleStatusChange}
        onClose={() => setShowMenu(false)}
      />
    </div>
  );
};

const StatusMenu = ({
  currentStatus,
  isPending,
  isOpen,
  onToggle,
  onStatusChange,
  onClose,
}: {
  currentStatus: ProductStatus;
  isPending: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onStatusChange: (status: ProductStatus) => void;
  onClose: () => void;
}) => (
  <div className="relative">
    <button
      onClick={onToggle}
      className="p-1.5 rounded-md text-muted cursor-pointer hover:text-foreground hover:bg-secondary transition-colors"
      title="Change status"
    >
      <MoreVertical className="h-4 w-4" />
    </button>

    {isOpen && (
      <>
        <div className="fixed inset-0 z-10" onClick={onClose} />
        <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-lg border border-border bg-card py-1 shadow-xl">
          <p className="px-3 py-1.5 text-xs font-medium text-muted uppercase tracking-wide border-b border-border">
            Change Status
          </p>
          {ALL_STATUSES.map(status => {
            const isActive = currentStatus === status;
            return (
              <button
                key={status}
                onClick={() => onStatusChange(status)}
                disabled={isActive || isPending}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm
                  hover:bg-background/20 cursor-pointer disabled:opacity-40 disabled:cursor-default transition-colors"
              >
                <span
                  className={`h-2 w-2 rounded-full shrink-0 ${STATUS_CONFIG[status].dot}`}
                />
                <span className={isActive ? 'font-medium' : ''}>
                  {STATUS_CONFIG[status].label}
                </span>
                {isActive && <span className="ml-auto text-xs text-muted">current</span>}
              </button>
            );
          })}
        </div>
      </>
    )}
  </div>
);
