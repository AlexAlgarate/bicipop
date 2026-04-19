'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Category {
  id: string;
  name: string;
}

interface FiltersPanelProps {
  categories: Category[];
}

export const FiltersPanel = ({ categories }: FiltersPanelProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [queryValue, setQueryValue] = useState(searchParams.get('query') ?? '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '');

  const updateParam = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      params.delete('page');
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname],
  );

  const handleQueryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      updateParam({ query: queryValue });
    }
  };

  const handlePriceBlur = () => {
    updateParam({ minPrice, maxPrice });
  };

  const clearAll = () => {
    setQueryValue('');
    setMinPrice('');
    setMaxPrice('');
    router.push(pathname);
  };

  return (
    <aside className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <span className="font-semibold text-foreground text-sm tracking-wide uppercase">
            Filtros
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Búsqueda
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar anuncios..."
              value={queryValue}
              onChange={(e) => setQueryValue(e.target.value)}
              onKeyDown={handleQueryKeyDown}
              onBlur={() => updateParam({ query: queryValue })}
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Pulsa Enter para buscar
          </p>
        </div>

        <div className="h-px bg-border" />

        {/* Order */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Ordenar por
          </label>
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <select
              value={searchParams.get('order') ?? 'desc'}
              onChange={(e) => updateParam({ order: e.target.value })}
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
            >
              <option value="desc">Más reciente primero</option>
              <option value="asc">Más antiguo primero</option>
            </select>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Category */}
        {categories.length > 0 && (
          <>
            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Categoría
              </label>
              <select
                value={searchParams.get('category') ?? ''}
                onChange={(e) => updateParam({ category: e.target.value })}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
              >
                <option value="">Todas las categorías</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="h-px bg-border" />
          </>
        )}

        {/* Price range */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Precio (€)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Mín"
              min={0}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              onBlur={handlePriceBlur}
              onKeyDown={(e) => e.key === 'Enter' && handlePriceBlur()}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
            <span className="text-muted-foreground text-sm shrink-0">—</span>
            <input
              type="number"
              placeholder="Máx"
              min={0}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              onBlur={handlePriceBlur}
              onKeyDown={(e) => e.key === 'Enter' && handlePriceBlur()}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Tab o Enter para aplicar
          </p>
        </div>

        <Button
          onClick={clearAll}
          className="flex items-center bg-background hover:bg-background/40 border border-border rounded-lg gap-4 text-sm text-foreground hover:text-foreground"
        >
          <X className="w-3 h-3" />
          Limpiar
        </Button>
      </div>
    </aside>
  );
};
