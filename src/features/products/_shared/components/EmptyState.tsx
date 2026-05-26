import { Search } from 'lucide-react';
import Link from 'next/link';

import { routes } from '@/config/routes';

interface EmptyStateProps {
  query?: string;
  title?: string;
  description?: string;
  showLink?: boolean;
}

export const EmptyState = ({ query, title, description, showLink }: EmptyStateProps) => {
  const isSearchEmpty = Boolean(query?.trim());

  const displayTitle =
    title ?? (isSearchEmpty ? `No results for "${query}"` : 'No products available');
  const displayDescription =
    description ??
    (isSearchEmpty
      ? 'Check the search field and try again.'
      : 'It looks like no one has posted anything yet. Be the first to sell your bike!');
  const shouldShowLink = showLink ?? !isSearchEmpty;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-border rounded-2xl bg-secondary/20 text-center">
      <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 shadow-sm text-2xl">
        {isSearchEmpty ? <Search className="w-7 h-7 text-muted-foreground" /> : '🚲'}
      </div>

      <>
        <h3 className="text-xl font-semibold mb-2">{displayTitle}</h3>
        <p className="text-muted-foreground mb-6 max-w-md">{displayDescription}</p>

        {shouldShowLink && (
          <Link
            href={routes.products.upload}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg py-2.5 px-6 shadow-lg transition-transform hover:-translate-y-0.5"
          >
            Sell your bike
          </Link>
        )}
      </>
    </div>
  );
};
