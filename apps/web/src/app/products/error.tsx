'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error(`[${error.digest ?? 'products/error'}] detalles:`, error);
  }, [error]);

  return (
    <div className="min-h-[calc(75vh-64px)] flex items-center justify-center px-4 ">
      <div className="text-center max-w-md p-4 border border-border rounded-lg shadow-sm">
        <div className="flex justify-center mb-6">
          <div className="bg-secondary rounded-full p-5">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-3">¡Algo salió mal!</h2>
        <p className="text-muted-foreground mb-6">
          Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.
        </p>

        <div className="mb-8 text-left">
          <Button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mx-auto"
          >
            {showDetails ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
            {showDetails ? 'Ocultar detalles' : 'Mostrar detalles'}
          </Button>

          {showDetails && (
            <pre className="mt-3 p-4 bg-secondary rounded-lg text-xs text-muted-foreground overflow-auto max-h-40 whitespace-pre-wrap break-all">
              {error.message}
            </pre>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={reset}
            className="w-full sm:w-auto inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-primary-foreground font-medium px-6 py-2.5 rounded-lg"
          >
            Intentar de nuevo
          </Button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center border border-border hover:bg-secondary text-foreground font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
