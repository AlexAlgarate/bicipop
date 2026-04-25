import z from 'zod';

import type {
  SearchParamValue,
  ProductsSearchParams,
} from '../types/search-params.types';

const searchParamsSchema = z.object({
  query: z.string().default(''),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().positive().default(1),
  category: z.string().trim().optional(),
  minPrice: z.coerce.number().int().positive().optional(),
  maxPrice: z.coerce.number().int().positive().optional(),
});

export const parseProductsSearchParams = (
  searchParams: Record<string, SearchParamValue>
): ProductsSearchParams => {
  const raw = {
    query: Array.isArray(searchParams.query) ? searchParams.query[0] : searchParams.query,
    order: Array.isArray(searchParams.order) ? searchParams.order[0] : searchParams.order,
    page: Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page,
    category: Array.isArray(searchParams.category) ? searchParams.category[0] : searchParams.category,
    minPrice: Array.isArray(searchParams.minPrice) ? searchParams.minPrice[0] : searchParams.minPrice,
    maxPrice: Array.isArray(searchParams.maxPrice) ? searchParams.maxPrice[0] : searchParams.maxPrice,
  };

  const parsed = searchParamsSchema.parse(raw);

  return {
    query: parsed.query ?? '',
    order: parsed.order,
    page: parsed.page,
    category: parsed.category && parsed.category.trim() !== '' ? parsed.category : undefined,
    minPrice: parsed.minPrice,
    maxPrice: parsed.maxPrice,
  };
};
