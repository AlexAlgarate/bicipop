export const ProductCardSkeleton = () => (
  <div className="flex flex-col h-full bg-white border border-border rounded-xl shadow-sm overflow-hidden animate-pulse">
    {/* Image */}
    <div className="relative w-full aspect-square bg-gray-200">
      <div className="absolute top-3 left-3 h-5 w-16 bg-gray-300 rounded-full" />
      <div className="absolute top-3 right-3 h-7 w-14 bg-gray-300 rounded-full" />
    </div>

    {/* Info */}
    <div className="flex flex-col flex-1 p-4">
      {/* Title and price */}
      <div className="flex justify-between items-start gap-3 mb-2">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/5" />
      </div>

      {/* Description */}
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-4/5" />
      </div>

      {/* Footer (user, location  and createdAt) */}
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-200" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="h-2.5 w-16 bg-gray-100 rounded" />
          <div className="h-2.5 w-12 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  </div>
);
