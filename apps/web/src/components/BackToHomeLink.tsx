import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const BackToHomeLink = () => {
  return (
    <div className="mb-6">
      <Link
        href="/"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Volver al inicio
      </Link>
    </div>
  );
};
