import { Search } from 'lucide-react';
import Link from 'next/link';

import { routes } from '@/utils/constants';

interface EmptyStateProps {
  query?: string;
}

export const EmptyState = ({ query }: EmptyStateProps) => {
  const isSearchEmpty = Boolean(query?.trim());
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-border rounded-2xl bg-secondary/20 text-center">
      <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 shadow-sm text-2xl">
        {isSearchEmpty ? <Search className="w-7 h-7 text-muted-foreground" /> : '🚲'}
      </div>

      {isSearchEmpty ? (
        <>
          <h3 className="text-xl font-semibold mb-2">
            No results for &quot;{query}&quot;
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Check the search field and try again.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-2">No products available</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            It looks like no one has posted anything yet. Be the first to sell your bike!
          </p>
          <Link
            href={routes.items.upload}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg py-2.5 px-6 shadow-lg transition-transform hover:-translate-y-0.5"
          >
            Sell your bike
          </Link>
        </>
      )}
    </div>
  );
};
