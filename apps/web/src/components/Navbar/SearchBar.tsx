'use client';

import { Search, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';

const DEBOUNCE_MS = 400;

interface SearchBarProps {
  mobileOpen?: boolean;
}

export const SearchBar = ({ mobileOpen = false }: SearchBarProps) => {
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
    <div
      className={`relative ${mobileOpen ? 'block w-full' : 'flex-1 max-w-2xl hidden md:block'}`}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Buscar productos..."
        autoFocus={mobileOpen}
        className="w-full py-2.5 pl-10 pr-8 bg-secondary text-foreground rounded-full placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
      />
      <Search className="w-4 h-4 text-muted absolute left-3.5 top-3.5 pointer-events-none" />
      {value && (
        <button
          onClick={handleClear}
          aria-label="Limpiar búsqueda"
          className="absolute right-3.5 top-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
