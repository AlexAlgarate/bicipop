import { Search } from 'lucide-react';
import Link from 'next/link';

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
            Sin resultados para &quot;{query}&quot;
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Revisa el campo de búsqueda y prueba de nuevo.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-2">No hay bicicletas disponibles</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Parece que nadie ha publicado nada aún. ¡Sé el primero en vender tu bici!
          </p>
          <Link
            href="/products/create"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full py-2.5 px-6 shadow-lg transition-transform hover:-translate-y-0.5"
          >
            Publicar anuncio
          </Link>
        </>
      )}
    </div>
  );
};
