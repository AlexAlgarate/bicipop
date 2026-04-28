import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { routes } from '@/utils/constants';

interface BackToProps {
  url?: string;
  title?: string;
}

export const BackToHomeLink = ({
  title = 'products',
  url = routes.home,
}: BackToProps) => {
  return (
    <div className="mb-6">
      <Link
        href={url}
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to {title}
      </Link>
    </div>
  );
};
