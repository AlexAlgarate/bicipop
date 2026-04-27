export type SearchParamValue = string | string[] | undefined;

export type ProductsPageSearchParams = Promise<Record<string, SearchParamValue>>;

export type ProductsSearchParams = {
  query: string;
  order: 'asc' | 'desc';
  page: number;
  category: string | undefined;
  minPrice: number | undefined;
  maxPrice: number | undefined;
};
