'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useOptimistic, useTransition } from 'react';
import { Star } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { toggleFavoriteAction } from '@/features/items/shared/action';
import { routes } from '@/utils/constants';
import { ProductStatus } from '@/generated/client/enums';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  likes: number;
  imageUrl: string;
  isLiked?: boolean;
  isOwner?: boolean;
  status: ProductStatus;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price);
};

const formatLikes = (likes: number) => {
  if (likes >= 1000) {
    return (likes / 1000).toFixed(1) + 'k';
  }
  return likes;
};

export const ProductCard = ({ product }: { product: ProductCardProps }) => {
  return (
    <Link
      href={`${routes.items.detail}/${product.id}`}
      className="
        group flex flex-col h-full bg-card 
        rounded-xl shadow-sm hover:shadow-2xl hover:-translate-y-1.5
        transition-all duration-300 ease-out overflow-hidden p-3"
    >
      <ProductImage product={product} />
      <ProductInfo product={product} />
    </Link>
  );
};

const ProductInfo = ({ product }: { product: ProductCardProps }) => {
  const [optimisticLikes, setOptimisticLikes] = useOptimistic(
    { likes: product.likes, isLiked: product.isLiked ?? false },
    (_state, action: { likes: number; isLiked: boolean }) => action
  );

  const [isPending, startTransition] = useTransition();

  const handleLikeClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (product.isOwner || isPending) return;

    startTransition(async () => {
      try {
        const result = await toggleFavoriteAction(product.id);
        setOptimisticLikes({ likes: result.likesCount, isLiked: result.liked });
      } catch (error) {
        console.error('[Error toggling favorite]', error);
      }
    });
  };

  const isDisabled = product.isOwner || isPending;

  return (
    <div className="flex flex-col flex-1 p-4 gap-2">
      <div className="flex justify-between items-center gap-3 mb-2">
        <p className="text-primary font-bold text-xl tracking-tight">
          {formatPrice(product.price)}
        </p>
        <FavoriteButton
          handleLikeClick={handleLikeClick}
          isDisabled={isDisabled}
          isLiked={optimisticLikes.isLiked}
          likes={optimisticLikes.likes}
          product={product.isOwner}
        />
      </div>

      <h3 className="font-medium line-clamp-2 text-lg leading-tight group-hover:text-primary">
        {product.title}
      </h3>
    </div>
  );
};

const StatusBadge = ({ product }: { product: ProductCardProps }) => {
  return (
    <span
      className="
        absolute top-3 left-3 z-10 px-3 py-1 text-[11px] uppercase font-semibold
        rounded-full tracking-wide shadow-sm backdrop-blur-md transition-all duration-300
        group-hover:scale-105 bg-amber-400/90 text-gray-900 ring-1 ring-amber-300/50"
    >
      {product.status}
    </span>
  );
};

const ProductImage = ({ product }: { product: ProductCardProps }) => {
  const isReserved = product.status === ProductStatus.RESERVED;

  return (
    <div className="relative aspect-square overflow-hidden rounded-lg">
      {isReserved && <StatusBadge product={product} />}

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

interface FavoriteButtonProps {
  handleLikeClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isDisabled: boolean;
  isLiked: boolean;
  likes: number;
  product?: boolean;
}

const FavoriteButton = ({
  handleLikeClick,
  isDisabled,
  isLiked,
  likes,
  product,
}: FavoriteButtonProps) => {
  return (
    <Button
      onClick={handleLikeClick}
      disabled={isDisabled}
      aria-label={isLiked ? 'Ya te gusta' : 'Me gusta'}
      className={`flex items-center gap-1.5 bg-gray-100
        px-2.5 py-1.5 text-gray-600
        hover:text-red-500 hover:bg-red-50
        transition-all duration-200
        w-fit mb-2.5 rounded-full
        ${isLiked ? 'text-red-500 bg-red-50' : ''}`}
      title={
        product
          ? 'No puedes dar like a tu propio producto'
          : isLiked
            ? 'Ya has dado like'
            : 'Dar like'
      }
    >
      <Star
        className={`w-5 h-5 transition-all duration-200 
          ${isLiked ? 'fill-current scale-110' : 'group-hover:scale-110'}`}
      />
      <p className="text-xs font-semibold">{formatLikes(likes)}</p>
    </Button>
  );
};
