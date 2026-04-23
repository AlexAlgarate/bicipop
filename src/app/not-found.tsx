import Link from 'next/link';
import { SearchX } from 'lucide-react';

const PageNotFound = () => {
  return (
    <div className="min-h-[calc(75vh-64px)] flex items-center justify-center px-4">
      <div className="text-center max-w-md p-4 border border-border rounded-lg shadow-sm">
        <div className="flex justify-center mb-6">
          <div className="bg-secondary rounded-full p-5">
            <SearchX className="w-10 h-10 text-muted-foreground" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-3">
          Página no encontrada
        </h2>
        <p className="text-muted-foreground mb-8">
          No existe la página que estás buscando.
        </p>

        <Link
          href="/"
          className="
          inline-flex items-center gap-2 bg-primary hover:bg-primary-hover
          text-primary-foreground font-medium px-6 py-2.5
          rounded-lg transition-colors
          "
        >
          Volver a la página de inicio
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
