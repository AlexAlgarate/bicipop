import z from 'zod';

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).default(12),
});

export const getPagination = (page: number, pageSize: number) => {
  const { page: validPage, pageSize: validPageSize } = paginationSchema.parse({
    page,
    pageSize,
  });

  return {
    page: validPage,
    pageSize: validPageSize,
  };
};
