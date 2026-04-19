export const ImageColumnSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {/* Debe coincidir exactamente con el div de ProductImageSection */}
    <div className="relative aspect-square md:aspect-4/3 w-full rounded-2xl bg-gray-200 border border-border overflow-hidden">
      <div className="absolute top-4 left-4 h-7 w-24 bg-gray-300 rounded-full" />
    </div>

    {/* Espejo de ProductDescription */}
    <div className="p-6 bg-card border border-border rounded-xl shadow-sm space-y-3">
      <div className="h-5 w-28 bg-gray-200 rounded" />
      <div className="space-y-2 pt-1">
        <div className="h-3.5 bg-gray-100 rounded w-full" />
        <div className="h-3.5 bg-gray-100 rounded w-full" />
        <div className="h-3.5 bg-gray-100 rounded w-3/4" />
      </div>
    </div>
  </div>
);
