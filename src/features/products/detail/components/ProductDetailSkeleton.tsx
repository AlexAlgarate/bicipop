'use client';

export const ProductDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-8 animate-pulse">
    <div className="h-6 w-24 bg-muted rounded mb-6" />

    <div className="grid gap-8 lg:grid-cols-2">
      <div className="aspect-square bg-muted rounded-xl" />

      <div className="space-y-6">
        <div>
          <div className="h-8 w-3/4 bg-muted rounded mb-2" />
          <div className="h-10 w-32 bg-muted rounded" />
        </div>

        <div className="space-y-2">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
          <div className="h-4 w-4/6 bg-muted rounded" />
        </div>

        <div>
          <div className="h-5 w-24 bg-muted rounded mb-2" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-3/4 bg-muted rounded" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-muted rounded-full" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>

        <div className="flex gap-3">
          <div className="h-12 w-40 bg-muted rounded-lg" />
          <div className="h-12 w-40 bg-muted rounded-lg" />
        </div>
      </div>
    </div>

    <div className="mt-12">
      <div className="h-7 w-40 bg-muted rounded mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card rounded-xl p-3 shadow-sm">
            <div className="aspect-square bg-muted rounded-lg mb-3" />
            <div className="h-5 w-20 bg-muted rounded mb-2" />
            <div className="h-4 w-full bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
