import type { Prisma } from '@/generated/client/client';

import type { FilterProducts } from '../types/filter.types';

// Inferido de Prisma — nunca se desincroniza con el schema
export type WhereClause = Prisma.ProductWhereInput;

export const getWhereClause = ({
  query,
  category,
  minPrice,
  maxPrice,
}: Pick<
  FilterProducts,
  'query' | 'category' | 'minPrice' | 'maxPrice'
>): WhereClause => ({
  ...(query && { title: { contains: query, mode: 'insensitive' } }),
  ...(category && { categoryId: category }),
  ...((minPrice || maxPrice) && {
    price: {
      ...(minPrice && { gte: minPrice }),
      ...(maxPrice && { lte: maxPrice }),
    },
  }),
});
