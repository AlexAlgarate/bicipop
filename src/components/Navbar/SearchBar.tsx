'use client';

import { Search, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';

const DEBOUNCE_MS = 400;

export const SearchBar = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [value, setValue] = useState(searchParams.get('query') ?? '');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function applySearch(query: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (query.trim()) {
      params.set('query', query.trim());
    } else {
      params.delete('query');
    }

    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setValue(next);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => applySearch(next), DEBOUNCE_MS);
  }

  function handleClear() {
    setValue('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    applySearch('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      applySearch(value);
    }
  }

  return (
    <form className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search for products..."
        className="w-full py-2.5 pl-10 pr-8 bg-secondary text-foreground rounded-lg placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
      />
      {value && (
        <button
          onClick={handleClear}
          aria-label="Limpiar búsqueda"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );
};
