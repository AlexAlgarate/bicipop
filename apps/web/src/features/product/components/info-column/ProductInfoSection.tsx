import { ProductHeader } from './product-header/ProductHeader';
import { AdManagementPanel } from './ActionButtons';
import { SellerCard } from './SellerCard';
import { formatCreatedDate, formatPrice } from '@/features/product/formatters';
import { ProductDTO } from '@/domain/products/types';

interface ProductInfoProps extends ProductDTO {
  isLiked: boolean;
  isOwner: boolean;
}

export const ProductInfoSection = ({ product }: { product: ProductInfoProps }) => {
  const price = formatPrice(product.price);
  const publishedAgo = formatCreatedDate(product.createdAt);

  return (
    <div className="bg-secondary/30 border border-border rounded-xl overflow-hidden">
      <ProductHeader
        title={product.title}
        price={price}
        location={product.location}
        publishedAgo={publishedAgo}
        likes={product.likes}
        productId={product.id}
        isLiked={product.isLiked}
        isOwner={product.isOwner}
      />

      <div className="border-t border-border">
        <SellerCard username={product.userName} />
      </div>

      <div className="border-t border-border">
        <AdManagementPanel adId={product.id} ownerId={product.userId} />
      </div>
    </div>
  );
};
