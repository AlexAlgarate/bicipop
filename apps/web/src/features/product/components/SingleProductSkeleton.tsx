import { ImageColumnSkeleton } from './image-column/ImageColumnSkeleton';
import { InfoColumnSkeleton } from './info-column/InfoColumnSkeleton';

export const SingleProductSkeleton = () => {
  return (
    <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      <ImageColumnSkeleton />
      <InfoColumnSkeleton />
    </div>
  );
};
