import { ShareButton } from './SharedButton';
import { FavoriteButton } from './FavoriteButton';
import { ProductMeta } from './ProductMeta';
import { getSession } from '@/lib/auth';

interface HeaderProps {
  title: string;
  price: string;
  location: string;
  publishedAgo: string;
  likes: number;
  productId: string;
  isLiked: boolean;
  isOwner: boolean;
}

export const ProductHeader = async ({
  title,
  price,
  location,
  publishedAgo,
  likes,
  productId,
  isLiked,
  isOwner,
}: HeaderProps) => {
  const session = await getSession();
  const isAuthenticated = !!session?.userId;

  return (
    <div className="p-5 space-y-3">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
          {title}
        </h1>
        <div className="flex gap-2">
          <ShareButton />
          <FavoriteButton
            initialLikes={likes}
            productId={productId}
            isLiked={isLiked}
            isOwner={isOwner}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
      <p className="text-4xl font-bold text-primary">{price}</p>
      <ProductMeta location={location} publishedAgo={publishedAgo} />
    </div>
  );
};
