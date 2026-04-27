export interface FilterProducts {
  query: string;
  order: 'asc' | 'desc';
  page: number;
  pageSize: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}
