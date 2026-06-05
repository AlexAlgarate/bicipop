'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, User } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { routes } from '@/config/routes';
import { ProductStatus } from '@/generated/client/enums';
import { formatPrice } from '@/utils/format';
import { useFavorite } from '@/features/products/_shared/hooks/useFavorite';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  isLiked?: boolean;
  isOwner?: boolean;
  status: ProductStatus;
  categoryName: string;
  location?: string;
  username: string;
}

interface FavoriteButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isDisabled: boolean;
  isFavorite: boolean;
  isOwner: boolean;
}

const FavoriteButton = ({
  onClick,
  isDisabled,
  isFavorite,
  isOwner,
}: FavoriteButtonProps) => (
  <Button
    onClick={onClick}
    disabled={isDisabled}
    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    className={`flex items-center gap-1.5 bg-gray-100 px-2.5 py-1.5 text-gray-600 rounded-full
      hover:text-yellow-500 hover:bg-yellow-50 transition-all duration-200 w-fit
      ${isFavorite ? 'text-yellow-500 bg-yellow-50' : ''}`}
  >
    <Star
      className={`${isOwner ? 'hidden' : ''} w-5 h-5 ${isFavorite ? 'fill-current scale-110 transition-all duration-200' : ''}`}
    />
  </Button>
);

interface ProductInfoProps {
  isOwner: boolean;
  price: number;
  title: string;
  username: string;
  isFavorite: boolean;
  isPending: boolean;
  onFavoriteClick: (e: React.MouseEvent) => void;
}

const ProductInfo = ({
  isOwner,
  price,
  title,
  isFavorite,
  username,
  isPending,
  onFavoriteClick,
}: ProductInfoProps) => {
  const isDisabled = isOwner || isPending;

  return (
    <div className="flex flex-col flex-1 p-4 gap-2 h-full">
      <div className="flex justify-between items-center gap-3">
        <p className="text-primary font-bold text-xl tracking-tight">
          {formatPrice(price)}
        </p>
        {!isOwner && (
          <FavoriteButton
            onClick={onFavoriteClick}
            isDisabled={isDisabled}
            isFavorite={isFavorite}
            isOwner={isOwner ?? false}
          />
        )}
      </div>
      <h3 className="font-medium line-clamp-2 text-lg leading-tight group-hover:text-primary">
        {title}
      </h3>
      <div className="mt-auto flex gap-2 items-center text-xs pt-2">
        <User className="w-4 h-4" /> Sold by{' '}
        <span className="font-medium text-sm">{username}</span>
      </div>
    </div>
  );
};

const STATUS_BADGE: Partial<Record<ProductStatus, { label: string; className: string }>> =
  {
    [ProductStatus.RESERVED]: {
      label: 'Reserved',
      className: 'bg-amber-400/90 text-gray-900 ring-amber-300/50',
    },
    [ProductStatus.SOLD]: {
      label: 'Sold',
      className: 'bg-gray-500/90 text-white ring-gray-400/50',
    },
  };

const StatusBadge = ({ status }: { status: ProductStatus }) => {
  const config = STATUS_BADGE[status];
  if (!config) return null;

  return (
    <span
      className={`
        absolute top-3 left-3 z-10 px-3 py-1 text-[11px] uppercase font-semibold
        rounded-full tracking-wide shadow-sm backdrop-blur-md ring-1 ${config.className}
        `}
    >
      {config.label}
    </span>
  );
};
const ProductImage = ({
  imageUrl,
  status,
  title,
}: {
  imageUrl: string;
  status: ProductStatus;
  title: string;
}) => {
  return (
    <div className="relative aspect-square overflow-hidden rounded-lg">
      <StatusBadge status={status} />
      <Image
        src={imageUrl}
        alt={title}
        fill
        loading="eager"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        unoptimized
      />
    </div>
  );
};

export const ProductCard = ({ product }: { product: ProductCardProps }) => {
  const { handleToogle, isFavorite, isPending } = useFavorite({
    productId: product.id,
    isLiked: product.isLiked ?? false,
    isOwner: product.isOwner ?? false,
  });

  return (
    <Link
      href={routes.products.detail(product.id)}
      className="group flex flex-col h-full bg-card rounded-xl shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 ease-out overflow-hidden p-3"
    >
      <ProductImage
        imageUrl={product.imageUrl}
        status={product.status}
        title={product.title}
      />
      <ProductInfo
        isOwner={product.isOwner ?? false}
        price={product.price}
        title={product.title}
        username={product.username}
        isFavorite={isFavorite}
        isPending={isPending}
        onFavoriteClick={handleToogle}
      />
    </Link>
  );
};
