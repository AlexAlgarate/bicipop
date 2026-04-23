'use client';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(`[${error.digest ?? 'global-error'}] detalles:`, error);
  }, [error]);

  return (
    <html>
      <body>
        <h2 className="text-2xl font-bold mb-2">¡Algo salió mal!</h2>
        <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
        <div>
          <button
            onClick={reset}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Intentar de nuevo.
          </button>
        </div>
      </body>
    </html>
  );
}
