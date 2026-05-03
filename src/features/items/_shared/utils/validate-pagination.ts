import z from 'zod';

import { PRODUCTS_PER_PAGE } from '@/utils/constants';

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).default(PRODUCTS_PER_PAGE),
});

export const validatePagination = (page: number, pageSize: number) => {
  const { page: validPage, pageSize: validPageSize } = paginationSchema.parse({
    page,
    pageSize,
  });

  return {
    page: validPage,
    pageSize: validPageSize,
  };
};
