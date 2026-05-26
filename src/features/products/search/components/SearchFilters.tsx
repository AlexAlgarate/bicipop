'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { MapPin, Search, SlidersHorizontal } from 'lucide-react';

import type { CategoryDTO } from '@/domain/category/types';

interface SearchFiltersProps {
  categories: CategoryDTO[];
}

export const SearchFilters = ({ categories }: SearchFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const pushParams = useCallback(
    (newParams: URLSearchParams) => {
      const params = new URLSearchParams(searchParams.toString());
      newParams.forEach((value, key) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        value ? params.set(key, value) : params.delete(key);
      });
      params.set('page', '1');
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, searchParams, pathname]
  );

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const params = new URLSearchParams();

    const fields = ['query', 'category', 'location', 'minPrice', 'maxPrice'] as const;
    fields.forEach(field => {
      const value = data.get(field) as string;
      if (value) params.set(field, value);
    });

    pushParams(params);
  };

  const handleClear = () => {
    setQuery('');
    setCategory('');
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    router.push(pathname);
  };

  const inputClass =
    'w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary';

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" />
          Filters
        </h2>
        <button
          onClick={() => setIsOpen(p => !p)}
          className="sm:hidden text-sm text-primary"
        >
          {isOpen ? 'Hide' : 'Show'}
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`space-y-4 ${isOpen ? '' : 'hidden sm:block'}`}
      >
        <div className="space-y-2">
          <label htmlFor="query" className="text-sm font-medium text-muted-foreground">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              id="query"
              name="query"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search products..."
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium text-muted-foreground">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className={inputClass}
          >
            <option value="">All categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="text-sm font-medium text-muted-foreground">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              id="location"
              name="location"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="City or region..."
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Price range</label>
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="number"
                name="minPrice"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                placeholder="Min"
                min="0"
                className={`${inputClass} flex-1`}
              />
            </div>
            <span className="self-center text-muted">-</span>
            <div className="flex-1">
              <input
                type="number"
                name="maxPrice"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                placeholder="Max"
                min="0"
                className={`${inputClass} flex-1`}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button type="submit" className="btn btn-primary flex-1">
            Apply
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="flex-1 btn hover:bg-primary-soft"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};
