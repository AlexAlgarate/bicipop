import prisma from '@/lib/prisma';

export const getCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });
};
