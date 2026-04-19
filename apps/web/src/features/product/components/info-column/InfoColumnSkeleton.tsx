export const InfoColumnSkeleton = () => (
  <div className="flex flex-col gap-6 animate-pulse">
    {/* ProductHeader */}
    <div className="space-y-2">
      {/* Title and buttons share and favoreite */}
      <div className="flex justify-between items-start gap-4">
        <div className="h-10 bg-gray-200 rounded w-3/4" />
        <div className="flex gap-2 shrink-0">
          <div className="w-9 h-9 bg-gray-200 rounded-md" />
          <div className="w-9 h-9 bg-gray-200 rounded-md" />
        </div>
      </div>

      {/* Price */}
      <div className="h-10 bg-gray-200 rounded w-2/5" />

      {/* location and createdAd */}
      <div className="flex items-center gap-4 pt-2">
        <div className="h-4 bg-gray-100 rounded w-20" />
        <div className="h-4 bg-gray-100 rounded w-36" />
      </div>
    </div>

    {/* Divider */}
    <div className="h-px bg-border w-full" />

    {/* SellerCard */}
    <div className="bg-secondary/30 p-4 rounded-xl flex items-center justify-between border border-border">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-14" />
          <div className="h-4 bg-gray-300 rounded w-20" />
        </div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-16" />
    </div>

    {/* ContactSellerButton */}
    <div className="flex flex-col gap-3">
      <div className="h-14 bg-gray-200 rounded-lg w-full" />
      <div className="h-3 bg-gray-100 rounded w-2/3 mx-auto" />
    </div>
  </div>
);
