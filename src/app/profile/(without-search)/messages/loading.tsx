'use client';

export default function MessagesLoading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="h-6 w-20 bg-muted rounded mb-6" />

      <div className="h-8 w-32 bg-muted rounded mb-2" />
      <div className="h-4 w-64 bg-muted rounded mb-8" />

      <div className="grid grid-cols-3 gap-4 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 bg-muted rounded-xl" />
        ))}
      </div>

      <div className="card">
        <div className="border-b border-border pb-4 mb-4">
          <div className="h-6 w-40 bg-muted rounded mb-2" />
          <div className="h-4 w-56 bg-muted rounded" />
        </div>

        <div className="divide-y divide-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-4 px-2">
              <div className="h-12 w-12 bg-muted rounded-full shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-3 w-48 bg-muted rounded" />
              </div>
              <div className="text-right space-y-1">
                <div className="h-3 w-16 bg-muted rounded ml-auto" />
                <div className="h-2 w-8 bg-muted rounded ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
