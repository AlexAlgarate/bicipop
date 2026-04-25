export const getPagination = (page: number, pageSize: number) => ({
  safePage: Number.isNaN(page) || page < 1 ? 1 : page,
  safePageSize: Number.isNaN(pageSize) || pageSize < 1 ? 5 : pageSize,
});
