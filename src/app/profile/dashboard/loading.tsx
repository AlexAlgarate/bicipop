'use client';

export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="h-6 w-20 bg-muted rounded mb-6" />

      <div className="h-8 w-48 bg-muted rounded mb-2" />
      <div className="h-4 w-64 bg-muted rounded mb-8" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-xl" />
        ))}
      </div>

      <div className="card">
        <div className="border-b border-border pb-4 mb-4">
          <div className="h-6 w-32 bg-muted rounded mb-2" />
          <div className="h-4 w-64 bg-muted rounded" />
        </div>

        <div className="divide-y divide-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-stretch gap-3 py-3 px-2">
              <div className="h-20 w-20 bg-muted rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-3/4 bg-muted rounded" />
                <div className="h-5 w-20 bg-muted rounded" />
                <div className="h-4 w-32 bg-muted rounded" />
              </div>
              <div className="flex flex-col items-end justify-between gap-2">
                <div className="h-6 w-16 bg-muted rounded-full" />
                <div className="flex gap-1">
                  <div className="h-8 w-8 bg-muted rounded-md" />
                  <div className="h-8 w-8 bg-muted rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}