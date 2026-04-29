import type { Prisma } from '@/generated/client/client';

import type { CategoryDTO } from './types';

type CategoryRaw = Prisma.CategoryGetPayload<true>;

export const mapToCategoryDTO = (category: CategoryRaw): CategoryDTO => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
});
