'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useOptimistic, useTransition } from 'react';
import { MapPin, Clock, Heart, User } from 'lucide-react';

import { toggleFavoriteAction } from '@/features/product/actions';
import { Button } from './ui/Button';
import { timeAgo } from '@/utils/date';

type ProductCardProps = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  likes: number;
  imageUrl: string;
  userName: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  isLiked?: boolean;
  isOwner?: boolean;
};

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
      href={`/products/${product.id}`}
      className="group flex flex-col h-full bg-white border border-border
      rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all
      duration-300 overflow-hidden"
    >
      <ProductImage product={product} />
      <ProductInfo product={product} />
    </Link>
  );
};

const ProductInfo = ({ product }: { product: ProductCardProps }) => {
  const created =
    typeof product.createdAt === 'string'
      ? new Date(product.createdAt)
      : product.createdAt;

  const [optimisticLikes, setOptimisticLikes] = useOptimistic(
    { likes: product.likes, isLiked: product.isLiked ?? false },
    (state, action: { likes: number; isLiked: boolean }) => action,
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
    <div className="flex flex-col flex-1 p-4">
      <div className="flex justify-between items-start gap-3 mb-2">
        <h3
          className="font-semibold text-gray-900 line-clamp-1 text-base leading-tight min-w-0 flex-1"
          title={product.title}
        >
          {product.title}
        </h3>
        <p className="text-[#00C18A] font-bold text-lg whitespace-nowrap">
          {formatPrice(product.price)}
        </p>
      </div>

      <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed h-10">
        {product.description}
      </p>

      <FavoriteButton
        handleLikeClick={handleLikeClick}
        isDisabled={isDisabled}
        isLiked={optimisticLikes.isLiked}
        likes={optimisticLikes.likes}
        product={product.isOwner}
      />
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0 border border-gray-200">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-medium text-gray-700 truncate max-w-25">
            {product.userName}
          </span>
        </div>

        <div className="flex flex-col items-end text-[10px] text-gray-400 gap-0.5">
          <div className="flex items-center gap-1">
            <span className="truncate max-w-20">{product.location}</span>
            <MapPin className="w-3 h-3" />
          </div>
          <div className="flex items-center gap-1.5">
            <span title={created.toLocaleDateString()}>{timeAgo(created)}</span>
            <Clock className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductImage = ({ product }: { product: ProductCardProps }) => {
  return (
    <div className="relative w-full aspect-square overflow-hidden bg-gray-100 border-b border-border">
      <span className="absolute top-3 left-3 z-10 bg-white/70 backdrop-blur-md px-2.5 py-1 text-xs uppercase font-bold rounded-full tracking-wide text-gray-700 shadow-sm">
        {product.category}
      </span>

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
      className={`flex items-center gap-1.5 bg-gray-200/50
        px-2.5 py-1.5 text-gray-700 hover:text-red-500 hover:border-red-200
        w-fit mb-2.5 shadow-sm ${isLiked ? 'text-red-500' : ''}`}
      title={
        product
          ? 'No puedes dar like a tu propio producto'
          : isLiked
            ? 'Ya has dado like'
            : 'Dar like'
      }
    >
      <Heart
        className={`w-3.5 h-3.5 transition-colors ${isLiked ? 'fill-current' : ''}`}
      />
      <p className="text-xs font-semibold">{formatLikes(likes)}</p>
    </Button>
  );
};
