'use client';

export const ProductCardSkeleton = () => (
  <div className="flex flex-col h-full bg-card rounded-xl shadow-sm overflow-hidden p-3 animate-pulse">
    <div className="relative aspect-square overflow-hidden rounded-lg bg-muted" />

    <div className="flex flex-col flex-1 p-4 gap-2">
      <div className="flex justify-between items-center gap-3">
        <div className="h-6 w-20 bg-muted rounded" />
        <div className="h-8 w-8 bg-muted rounded-full" />
      </div>

      <div className="space-y-2">
        <div className="h-5 bg-muted rounded w-full" />
        <div className="h-5 bg-muted rounded w-3/4" />
      </div>

      <div className="mt-auto flex gap-2 items-center text-xs pt-2">
        <div className="h-4 w-4 bg-muted rounded" />
        <div className="h-4 w-20 bg-muted rounded" />
      </div>
    </div>
  </div>
);