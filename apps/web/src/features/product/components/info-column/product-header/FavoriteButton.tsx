'use client';

import { Button } from '@/components/ui/Button';
import { toggleFavoriteAction } from '@/features/product/actions';
import { Heart } from 'lucide-react';
import { useOptimistic, useTransition } from 'react';

interface LikeButtonProps {
  initialLikes: number;
  productId: string;
  isLiked: boolean;
  isOwner: boolean;
  isAuthenticated: boolean;
}

export const FavoriteButton = ({
  initialLikes,
  productId,
  isLiked: initialIsLiked,
  isOwner,
  isAuthenticated,
}: LikeButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const [optimisticState, addOptimistic] = useOptimistic(
    { likes: initialLikes, isLiked: initialIsLiked },
    (state, action: { likes: number; isLiked: boolean }) => action,
  );

  const handleClick = () => {
    if (!isAuthenticated || isOwner || isPending) return;

    startTransition(async () => {
      try {
        const result = await toggleFavoriteAction(productId);
        addOptimistic({ likes: result.likesCount, isLiked: result.liked });
      } catch (error) {
        console.error(`[Error toggling favorite] -- ID: ${productId}`, error);
      }
    });
  };

  const isDisabled = !isAuthenticated || isOwner || isPending;

  return (
    <Button
      onClick={handleClick}
      disabled={isDisabled}
      className={`flex- flex-col items-center px-3
        hover:bg-secondary text-muted-foreground ${
          optimisticState.isLiked ? 'text-red-500' : 'hover:text-red-500'
        }`}
      title={
        !isAuthenticated
          ? 'Inicia sesión para dar like'
          : isOwner
            ? 'No puedes dar like a tu propio producto'
            : 'Toggle like'
      }
    >
      <Heart className={`w-5 h-5 ${optimisticState.isLiked ? 'fill-current' : ''}`} />{' '}
      {optimisticState.likes}
    </Button>
  );
};
