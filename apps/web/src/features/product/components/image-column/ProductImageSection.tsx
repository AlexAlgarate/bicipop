import Image from 'next/image';
import { ProductDescription } from './ProductDescriptionSection';
import { ProductDTO } from '@/domain/products/types';

interface ProductImageSectionProps {
  product: ProductDTO;
}
export const ProductImageSection = ({ product }: ProductImageSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="relative aspect-square md:aspect-4/3 w-full overflow-hidden rounded-2xl bg-gray-100 border border-border shadow-sm">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          priority
          className="object-cover hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/70 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
            {product.category}
          </span>
        </div>
      </div>
      <ProductDescription description={product.description} />
    </div>
  );
};
