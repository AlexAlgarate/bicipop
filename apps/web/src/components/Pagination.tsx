'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export const Pagination = ({ currentPage, totalPages }: PaginationProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { push } = useRouter();

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    push(`${pathname}?${params.toString()}`);
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <p className="text-sm text-muted-foreground font-medium">
        Mostrando página {currentPage} de {totalPages}
      </p>
      <nav
        aria-label="Paginación"
        className="flex items-center gap-1 bg-white p-1 rounded-full shadow-sm border border-gray-100"
      >
        <PaginationArrow
          direction="left"
          onClick={() => createPageUrl(currentPage - 1)}
          isDisabled={currentPage <= 1}
        />

        <div className="flex items-center gap-1 mx-2">
          {allPages.map((page, index) => {
            if (page === '...') {
              return <PaginationEllipsis key={`ellipsis-${index}`} />;
            }

            return (
              <PaginationNumber
                key={page}
                page={page}
                isActive={currentPage === page}
                onClick={() => createPageUrl(page)}
              />
            );
          })}
        </div>

        <PaginationArrow
          direction="right"
          onClick={() => createPageUrl(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
        />
      </nav>
    </div>
  );
};
const PaginationNumber = ({
  page,
  isActive,
  onClick,
}: {
  page: number | string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <Button
    onClick={onClick}
    aria-current={isActive ? 'page' : undefined}
    className={`
      h-9 w-9 flex items-center justify-center text-sm font-medium transition-all duration-200
      ${
        isActive
          ? 'bg-primary text-white shadow-md scale-105 '
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }
    `}
  >
    {page}
  </Button>
);

const PaginationArrow = ({
  direction,
  onClick,
  isDisabled,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
  isDisabled: boolean;
}) => {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;

  return (
    <Button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        h-9 w-9 flex items-center justify-center rounded-full
        ${
          isDisabled
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:bg-gray-100 hover:text-primary active:bg-gray-200'
        }
      `}
      aria-label={direction === 'left' ? 'Página anterior' : 'Página siguiente'}
    >
      <Icon className="w-5 h-5" />
    </Button>
  );
};

const PaginationEllipsis = () => (
  <span className="flex items-center justify-center h-9 w-9 text-gray-400">
    <MoreHorizontal className="w-4 h-4" />
  </span>
);

const generatePagination = (
  currentPage: number,
  totalPages: number,
): (string | number)[] => {
  // Si hay 5 páginas o menos, mostrar todas sin puntos suspensivos
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Si estamos en las primeras 3 páginas: Mostrar [1, 2, 3, ..., última página]
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages];
  }

  // Si estamos en las últimas 3 páginas
  if (currentPage >= totalPages - 2) {
    return [1, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // Si estamos en medio: Mostrar [1, ..., p-1, p, p+1, ..., última]
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};
