import { useOptimistic, useTransition } from 'react';

import { toggleFavoriteAction } from '../actions';

interface UseFavoriteProps {
  productId: string;
  isLiked: boolean;
  isOwner: boolean;
}

export const useFavorite = ({ productId, isLiked, isOwner }: UseFavoriteProps) => {
  const [isFavorite, setIsFavorite] = useOptimistic(
    isLiked,
    (_state, action: boolean) => action
  );

  const [isPending, startTransition] = useTransition();

  const handleToogle = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (isOwner || isPending) return;

    startTransition(async () => {
      try {
        const result = await toggleFavoriteAction(productId);
        setIsFavorite(result.liked);
      } catch (error) {
        console.error('[Error toggling favorite]', error);
      }
    });
  };

  return { isFavorite, isPending, handleToogle };
};
