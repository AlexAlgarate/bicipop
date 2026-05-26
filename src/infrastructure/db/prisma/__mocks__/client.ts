import { vi } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma: Record<string, Record<string, any>> = {
  user: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  product: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  category: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
  },
  favorite: {
    findUnique: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
  conversation: {
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
  message: {
    create: vi.fn(),
    findMany: vi.fn(),
    updateMany: vi.fn(),
  },
};

export default prisma;
export { prisma };
