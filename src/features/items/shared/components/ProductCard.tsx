'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useOptimistic, useTransition } from 'react';
import { Star } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { toggleFavoriteAction } from '@/features/items/shared/action';
import { routes } from '@/utils/constants';
import { ProductStatus } from '@/generated/client/enums';
import { formatPrice } from '@/utils/format';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  isLiked?: boolean;
  isOwner?: boolean;
  status: ProductStatus;
}

interface FavoriteButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isDisabled: boolean;
  isFavorite: boolean;
}

const FavoriteButton = ({ onClick, isDisabled, isFavorite }: FavoriteButtonProps) => (
  <Button
    onClick={onClick}
    disabled={isDisabled}
    aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
    className={`flex items-center gap-1.5 bg-gray-100 px-2.5 py-1.5 text-gray-600 rounded-full
      hover:text-yellow-500 hover:bg-yellow-50 transition-all duration-200 w-fit
      ${isFavorite ? 'text-yellow-500 bg-yellow-50' : ''}`}
    title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
  >
    <Star className={`w-5 h-5 ${isFavorite ? 'fill-current scale-110 transition-all duration-200' : ''}`} />
  </Button>
);

interface ProductInfoProps {
  product: ProductCardProps;
  isFavorite: boolean;
  isPending: boolean;
  onFavoriteClick: (e: React.MouseEvent) => void;
}

const ProductInfo = ({ product, isFavorite, isPending, onFavoriteClick }: ProductInfoProps) => {
  const isDisabled = product.isOwner || isPending;

  return (
    <div className="flex flex-col flex-1 p-4 gap-2">
      <div className="flex justify-between items-center gap-3 mb-2">
        <p className="text-primary font-bold text-xl tracking-tight">{formatPrice(product.price)}</p>
        {!product.isOwner && (
          <FavoriteButton
            onClick={onFavoriteClick}
            isDisabled={isDisabled}
            isFavorite={isFavorite}
          />
        )}
      </div>
      <h3 className="font-medium line-clamp-2 text-lg leading-tight group-hover:text-primary">
        {product.title}
      </h3>
    </div>
  );
};

const StatusBadge = ({ status }: { status: ProductStatus }) => (
  <span className="absolute top-3 left-3 z-10 px-3 py-1 text-[11px] uppercase font-semibold rounded-full tracking-wide shadow-sm backdrop-blur-md transition-all duration-300 group-hover:scale-105 bg-amber-400/90 text-gray-900 ring-1 ring-amber-300/50">
    {status}
  </span>
);

const ProductImage = ({ product }: { product: ProductCardProps }) => {
  const isReserved = product.status === ProductStatus.RESERVED;

  return (
    <div className="relative aspect-square overflow-hidden rounded-lg">
      {isReserved && <StatusBadge status={product.status} />}
      <Image
        src={product.imageUrl}
        alt={product.title}
        fill
        loading="eager"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </div>
  );
};

export const ProductCard = ({ product }: { product: ProductCardProps }) => {
  const [isFavorite, setIsFavorite] = useOptimistic(
    product.isLiked ?? false,
    (_state, action: boolean) => action
  );

  const [isPending, startTransition] = useTransition();

  const handleFavoriteClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (product.isOwner || isPending) return;

    startTransition(async () => {
      try {
        const result = await toggleFavoriteAction(product.id);
        setIsFavorite(result.liked);
      } catch (error) {
        console.error('[Error toggling favorite]', error);
      }
    });
  };

  return (
    <Link
      href={`${routes.items.detail}/${product.id}`}
      className="group flex flex-col h-full bg-card rounded-xl shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 ease-out overflow-hidden p-3"
    >
      <ProductImage product={product} />
      <ProductInfo
        product={product}
        isFavorite={isFavorite}
        isPending={isPending}
        onFavoriteClick={handleFavoriteClick}
      />
    </Link>
  );
};
