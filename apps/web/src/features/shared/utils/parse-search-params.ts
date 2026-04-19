import { SearchParamValue, ProductsSearchParams } from '../types/search-params.types';

const getSingleSearchParam = (value: SearchParamValue): string | undefined => {
  if (Array.isArray(value)) return value[0];
  return value;
};

export const parseProductsSearchParams = (
  searchParams: Record<string, SearchParamValue>,
): ProductsSearchParams => {
  const rawMinPrice = Number(getSingleSearchParam(searchParams.minPrice));
  const rawMaxPrice = Number(getSingleSearchParam(searchParams.maxPrice));
  const rawCategory = getSingleSearchParam(searchParams.category);

  return {
    query: getSingleSearchParam(searchParams.query) ?? '',
    order: (getSingleSearchParam(searchParams.order) as 'asc' | 'desc') ?? 'desc',
    page: Number(getSingleSearchParam(searchParams.page)) || 1,
    category: rawCategory && rawCategory.trim() !== '' ? rawCategory : undefined,
    minPrice: !isNaN(rawMinPrice) && rawMinPrice > 0 ? rawMinPrice : undefined,
    maxPrice: !isNaN(rawMaxPrice) && rawMaxPrice > 0 ? rawMaxPrice : undefined,
  };
};
