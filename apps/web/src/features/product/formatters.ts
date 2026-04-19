import { timeAgo } from '@/utils/date';

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatCreatedDate = (date: Date | string): string => {
  const parsed = typeof date === 'string' ? new Date(date) : date;
  return timeAgo(parsed);
};
